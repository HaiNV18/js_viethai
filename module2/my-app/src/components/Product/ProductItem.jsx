import "./ProductItem.css";

function ProductItem({ name, price }) {
  return (
    <div className="product-item">
      <h3>{name}</h3>
      <p>Price: ${price}</p>
    </div>
  );
}

export default ProductItem;
