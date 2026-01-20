import { useEffect, useRef } from "react";

export default function TerminalBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    function draw() {
      ctx.fillStyle = "rgba(11, 15, 20, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 1; i < 800; i++) {
        const F = (260 * (t + 9)) / i + Math.sin(i * i);
        const x = canvas.width / 2 + i * Math.sin(F);
        const y = canvas.height / 2 + 0.2 * (2 * i * Math.cos(F) + 20000 / i);
        const size = Math.sin(i) * 2 + 3;

        ctx.fillStyle = `rgba(126, 231, 135, ${0.03 + i / 5000})`;
        ctx.fillRect(x, y, size, size);
      }

      t += 0.01;
      requestAnimationFrame(draw);
    }

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "#000",
      }}
    />
  );
}
