import { useState } from 'react';
import ProductItem from "../Product/ProductItem";
import LikeButton from "../LikeButton/LikeButton";
import TableProduct from "../TableProduct/TableProduct";

function Content({ name }) {
    const title = "Dashboard";
    const skills = ["HTML", "CSS", "React"];

    const [count, setCount] = useState(0);

    return (
        <main className="content">
            <h2>{title}</h2>
            {name ? (
                <p>Xin chào {name}</p>
            ) : (
                <p>Bạn chưa đăng nhập.</p>
            )}


            <ul>
                {skills.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>

            <h2>{count}</h2>

            <button onClick={() => setCount(count + 1)}>
                Increase
            </button>

            <h2>Danh sách sản phẩm</h2>

            <ProductItem name={"Laptop"} price={1000}/>
            <ProductItem name={"Smartphone"} price={500}/>
            <ProductItem name={"Tablet"} price={300}/>
            <ProductItem name={"Computer"} price={1500}/>

            <TableProduct />

            <LikeButton />
        </main>
    );
}

export default Content;
