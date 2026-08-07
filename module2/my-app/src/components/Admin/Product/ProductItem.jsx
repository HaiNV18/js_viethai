import "./ProductItem.css";

function ProductItem({ name, price }) {
  return (
    <div className="product-item">
      <img src="/asset/img/products/iphone15.jpg" alt={name} />
      <h3>{name}</h3>
      <p>Price: ${price}</p>
    </div>
  );
}

export default ProductItem;
