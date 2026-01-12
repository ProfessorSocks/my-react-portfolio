import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
       <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Camille West</h1>
      <h2>Software / IT / Engineering Student</h2>

      <p>
        Welcome to my portfolio. This site is built with React and documents my
        learning process and projects.
      </p>

      <h3>Projects</h3>
      <ul>
        <li>React Resume Website (this site)</li>
        <li>Python Learning Repository</li>
        <li>3D Printing & Engineering Tools</li>
      </ul>

      <h3>Contact</h3>
      <p>Email: Camillewest2002@gmail.com</p>
      <p>GitHub: github.com/ProfessorSocks</p>
    </div>
  )
}

export default App
