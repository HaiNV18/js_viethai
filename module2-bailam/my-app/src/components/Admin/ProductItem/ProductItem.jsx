import './ProductItem.css'

const ProductItem = (props) => {
    // Chuyển props thành 3 biến
    const {name, price, img} = props.item;

    return <div className="product-item">
        <img src={"asset/img/products/" + img} alt="" width={100} />
        <h3>{name}</h3>
        <p>Price: ${price}</p>
    </div>;
}

export default ProductItem
