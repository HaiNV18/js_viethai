import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import type { User } from "./interfaces/User";
import UserRole from "./enum/UserRole.enum";
import UserDetail from "./component/UserDetail/UserDetail"

import './App.css'

function tinhtongTS(a: number, b: number): number {
  return a + b;
}

function App() {
  const [count, setCount] = useState(0)

  const currentUser: UserRole = UserRole.ADMIN;
  var hello = "";
  if (currentUser === UserRole.ADMIN) {
    hello = "Hello Admin";
  } else if (currentUser === UserRole.EDITOR) {
    hello = "Hello Editor";
  } else if (currentUser === UserRole.VIEWER) {
    hello = "Hello Viewer";
  }

  const checkPermission = (role: Role): boolean => {
    return role === UserRole.ADMIN;
  };

  const user: User = {
    id: 1,
    username: "hoang_fullstack",
    email: "contact@csc.edu.vn",
    age: 20,
    avatar: "avatar.jpg",
    status: "active",
    role: UserRole.ADMIN
  };
  const checkRole = checkPermission(user.role);
  console.log(checkRole)

  const formatPrice = (amount: number, currency: string = "VND"): string => {
    return `${amount.toLocaleString()} ${currency}`;
  };


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

      <p>Tính tổng: {tinhtongTS(10,20)}</p>

      <UserDetail data={user} />

      <p>Role: {hello}</p>

      <p>{formatPrice(100000)}</p>

    </>
  )
}

export default App
