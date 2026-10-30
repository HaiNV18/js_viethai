import { useState } from "react";
import { useParams } from "react-router-dom";

import "./CategoryProduct.css";

const CategoryProduct = () => {

    const { slug } = useParams();

    return (
        <div>
            Đây là CategoryProduct
            Loại sản phẩm: {slug}
        </div>
    );
}

export default CategoryProduct;
