import { useRef } from "react";

function TextInputWithFocusButton() {
    // 1. Khởi tạo một ref với giá trị ban đầu là null
    const inputEl = useRef(null);

    const onButtonClick = () => {
        // 2. .current trỏ trực tiếp đến thẻ <input> thật trong DOM
        inputEl.current.focus();
        inputEl.current.style.backgroundColor = "yellow";
        inputEl.current.placeholder = "abc";
    };

    return (
        <>
        {/* 3. Gắn nhãn tên inputEl vào thẻ input này */}
        <input ref={inputEl} type="text" />
        <button onClick={onButtonClick}>Focus và Tô màu ô input</button>
        </>
    );
}

export default TextInputWithFocusButton
