import { useState } from 'react';
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Content from "./components/Content/Content";
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
