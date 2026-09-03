import { useEffect, useState } from 'react';
import ProductItem from "../Product/ProductItem";
import LikeButton from "../LikeButton/LikeButton";
import TableProduct from "../TableProduct/TableProduct";
import ProductList from "../ProductList/ProductList";

function Content({ name }) {
    const title = "Dashboard";
    const skills = ["HTML", "CSS", "React"];

    // Làm memo:
    // Bước 1: tạo console.log check render
    // Bước 2: tạo memo cho LikeButton

    // Khi click count -> count re-render
    // Nhưng LikeButton không re-render vì LikeButton có memo
    const [count, setCount] = useState(0);
    console.log("Kiểm tra Content render");

    const [products, setProducts] = useState([]);
    const fetchData = async () => {
        try {
            const res = await fetch("https://dummyjson.com/products");

            // Kiểm tra nếu phản hồi không thành công (Status Code không nằm trong khoảng 200-299)
            if (!res.ok) {
                throw new Error("Lỗi hệ thống: " + res.status);
            }

            const data = await res.json();

            setProducts(data.products);
        } catch (error) {
            console.error("Có lỗi xảy ra:", error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



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



            <h1>Danh sách sản phẩm</h1>

            {products.map((product) => (
                <div key={product.id}>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                </div>
            ))}


        </main>
    );
}

export default Content;
