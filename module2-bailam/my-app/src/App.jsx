import { useState } from 'react'
import Content from './components/Admin/Content/Content.jsx'
import Header from './components/Admin/Header/Header.jsx'
import Sidebar from './components/Admin/Sidebar/Sidebar.jsx'
import './App.css'

function App() {

  const [name, setName] = useState("");

  return (
    <>
      <Header onLogin={setName} />
      <div className="layout">
        <Sidebar />
        <Content name={name} />
      </div>
    </>
  );
}

export default App
