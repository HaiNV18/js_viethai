import { useState, useEffect } from 'react'
import TextInputWithFocusButton from '../../../components/Admin/TextInputWithFocusButton/TextInputWithFocusButton.jsx'
import LikeButton from '../../../components/Admin/LikeButton/LikeButton.jsx'
import Timer from '../../../components/Admin/Timer/Timer.jsx'
import './Content.css'

function Content() {

  const [count, setCount] = useState(0)
  const [color, setColor] = useState("red")

  // Hàm chạy lại mỗi khi re-render
  console.log("Component re-render");

  // Biến thông thường: Sẽ bị reset về 1 mỗi lần re-render
  let normalVar = 1;
  normalVar++; // bằng 2

  const handleClick = (e) => {
    console.log("Tọa độ X:", e.clientX);
    console.log("Tọa độ Y:", e.clientY);
    console.log("Bạn vừa click vào thẻ:", e.target.tagName);
  };

  const handleClickLink = (e) => {
    e.preventDefault();
    alert("Link này đã bị chặn!");
  };

  function randomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }
  console.log(randomNumber());

  const isShowTimer = true;

  useEffect(() => {
    alert("Chương trình săn deal bắt đầu!")
  },[])

  return (
    <main className="content">
      <h1 style={{ color: 'red' }}>Content</h1>

      {isShowTimer && (
        <Timer/>
      )}



      <button onClick={handleClick}>
        Click vào vùng này để xem báo cáo!
      </button>

      <a href='https://www.google.com/' onClick={handleClickLink}>
        Click vào vùng này để xem báo cáo!
      </a>






      <h1>{"State " +count}</h1>
      <h1>{"Biến thường " + normalVar}</h1>

      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>




      <div style={{backgroundColor: color, width: 50, height: 50 }}></div>

      <button onClick={() => setColor("blue")}>
        Change color to blue
      </button>

      <button onClick={() => setColor("red")}>
        Change color to red
      </button>




      <LikeButton />

      <TextInputWithFocusButton />

    </main>
  )
}

export default Content
