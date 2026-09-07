import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import type { User } from "./interfaces/User";
import './App.css'

const user: User = {
  id: 1,
  username: "hoang_fullstack",
  email: "contact@csc.edu.vn",
};

function tinhTongTS(a: number, b: number): number {
  return a + b;
}

function App() {
  const [count, setCount] = useState(0)

  console.log(tinhTongTS(10, 20));

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <p>Tính tổng: {tinhTongTS(10, 20)}</p>

      <p>ID: {user.id}</p>
    </>
  )
}

export default App
