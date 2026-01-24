import os
import sys
import json
import pathlib
import requests
from typing import List, Tuple

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "deepseek-coder:6.7b"

def safe_join(root: pathlib.Path, rel: str) -> pathlib.Path:
    # Prevent path traversal outside root
    p = (root / rel).resolve()
    if not str(p).startswith(str(root.resolve())):
        raise ValueError(f"Refusing to access outside project root: {rel}")
    return p

def list_files(root: pathlib.Path, exts: Tuple[str, ...] = (".py", ".js", ".ts", ".md", ".json", ".yml", ".yaml")) -> List[str]:
    out = []
    for path in root.rglob("*"):
        if path.is_file():
            # skip huge/irrelevant folders
            parts = set(path.parts)
            if any(x in parts for x in [".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build"]):
                continue
            if path.suffix.lower() in exts:
                # store relative path
                out.append(str(path.relative_to(root)))
    return sorted(out)

def read_text(root: pathlib.Path, rel: str, max_chars: int = 12000) -> str:
    p = safe_join(root, rel)
    data = p.read_text(encoding="utf-8", errors="ignore")
    if len(data) > max_chars:
        return data[:max_chars] + f"\n\n[TRUNCATED: file is {len(data)} chars]"
    return data

def write_text(root: pathlib.Path, rel: str, content: str) -> None:
    p = safe_join(root, rel)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")

def ollama_chat(messages):
    payload = {
        "model": MODEL,
        "messages": messages,
        "stream": False
    }
    r = requests.post(OLLAMA_URL, json=payload, timeout=300)
    r.raise_for_status()
    return r.json()["message"]["content"]

def build_repo_context(root: pathlib.Path, max_files: int = 30) -> str:
    files = list_files(root)
    head = files[:max_files]
    chunks = []
    chunks.append("Repository file list (subset):\n" + "\n".join(f"- {f}" for f in head))
    # read a few key files if present
    priority = ["README.md", "pyproject.toml", "package.json", "docker-compose.yml", "docker-compose.yaml", "requirements.txt"]
    for name in priority:
        if name in files:
            chunks.append(f"\n\n---\n{name}:\n{read_text(root, name)}")
    return "\n".join(chunks)

def main():
    if len(sys.argv) < 3:
        print("Usage: python local_agent.py <project_folder> <instruction>")
        print(r'Example: python local_agent.py "C:\projects\mybot" "Generate architecture + README.md"')
        sys.exit(1)

    project_folder = pathlib.Path(sys.argv[1]).expanduser()
    instruction = " ".join(sys.argv[2:])

    if not project_folder.exists():
        print(f"Project folder not found: {project_folder}")
        sys.exit(1)

    repo_context = build_repo_context(project_folder)

    system = (
        "You are a senior software architect and coding assistant.\n"
        "You will propose a clean architecture, file structure, and implementation plan.\n"
        "When you want to create or update files, output a JSON array named FILES with objects:\n"
        '  {"path": "relative/path.ext", "content": "full file content"}\n'
        "Only include files that should be created/updated.\n"
        "Do NOT include any absolute paths.\n"
    )

    user = (
        f"PROJECT_ROOT: {project_folder}\n\n"
        f"{repo_context}\n\n"
        f"INSTRUCTION:\n{instruction}\n\n"
        "If you need more file contents, ask for them explicitly by filename.\n"
        "If you output FILES JSON, keep it valid JSON.\n"
    )

    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user}
    ]

    response = ollama_chat(messages)
    print("\n=== MODEL RESPONSE ===\n")
    print(response)

    # Try to extract FILES JSON if present
    marker = "FILES"
    if marker in response:
        # simple heuristic: find first '[' after 'FILES'
        idx = response.find(marker)
        bracket = response.find("[", idx)
        if bracket != -1:
            json_text = response[bracket:]
            try:
                files_obj = json.loads(json_text)
                if isinstance(files_obj, list):
                    print("\n=== APPLYING FILE CHANGES ===\n")
                    for f in files_obj:
                        path = f.get("path")
                        content = f.get("content", "")
                        if not path or not isinstance(path, str):
                            continue
                        write_text(project_folder, path, content)
                        print(f"Wrote: {path}")
            except Exception as e:
                print("\n[Info] FILES JSON detected but could not parse/apply automatically.")
                print("Error:", e)

if __name__ == "__main__":
    main()
