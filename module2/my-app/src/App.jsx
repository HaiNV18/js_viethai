import { useState } from 'react';
import Header from "./components/Admin/Header/Header";
import Sidebar from "./components/Admin/Sidebar/Sidebar";
import Content from "./components/Admin/Content/Content";
import './App.css';

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
