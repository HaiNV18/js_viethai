import React, { useState, useEffect } from 'react';

function Timer() {
    const [count, setCount] = useState(5);

    useEffect(() => {
        if (count === 0) return;
        // Cú pháp thiết lập bộ đếm mỗi 1 giây tăng 1 lần
        const timer = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
            console.log("Đồng hồ đếm ngược: ", count - 1);
        }, 1000);

        // Cleanup Function: Dọn dẹp bộ đếm khi Component bị ẩn hoặc đếm xong
        return () => {
            clearInterval(timer); // Dừng bộ đếm ngay lập tức
            console.log("Đã dọn dẹp bộ đếm!");
        };
    }, [count]); // Chạy 1 lần duy nhất để khởi động đồng hồ

    useEffect(() => {
        if (count === 0) {
            document.title = "HẾT GIỜ SĂN DEAL";
        } else {
            document.title = "CÒN " + count + " GIÂY";
        }
    }, [count])

    return (
        <>
            <h1>Còn: {count} giây</h1>
            {count === 0 && <p>Hết thời gian săn deal!</p>}
        </>
    );
}

export default Timer;
