import "./TableProduct.css";

function TableProduct() {
  const products = [
    {
      id: 1,
      image: "/asset/img/products/iphone15.jpg",
      name: "Laptop",
      quantity: 10,
    },
    {
      id: 2,
      image: "/asset/img/products/iphone15.jpg",
      name: "Smartphone",
      quantity: 15,
    },
    {
      id: 3,
      image: "/asset/img/products/iphone15.jpg",
      name: "Tablet",
      quantity: 8,
    },
    {
      id: 4,
      image: "/asset/img/products/iphone15.jpg",
      name: "Computer",
      quantity: 5,
    },
  ];

  const handleEdit = (id) => {
    alert(`Edit product ${id}`);
  };

  const handleRemove = (id) => {
    alert(`Remove product ${id}`);
  };

  return (
    <div className="list-product">
      <h2>Quản lý sản phẩm</h2>

      <table>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên</th>
            <th>Số lượng</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </td>

              <td>{product.name}</td>

              <td>{product.quantity}</td>

              <td>
                <button onClick={() => handleEdit(product.id)}>
                  Edit
                </button>
              </td>

              <td>
                <button
                  className="btn-remove"
                  onClick={() => handleRemove(product.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableProduct;
