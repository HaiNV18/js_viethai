import { useNavigate } from "react-router-dom";

import "./ListProductItem.css";

const ListProductItem = (props) => {
    const { id, name, price, thumbnail } = props.item;
    const { checked, onSelect } = props;

    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/detail-product/${id}/edit`);
    };

    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onSelect(id)}
                />
            </td>

            <td>{id}</td>

            <td>{name}</td>

            <td>{price} VNĐ</td>

            <td>
                <img
                    src={"asset/img/products/" + thumbnail}
                    alt={name}
                    width={100}
                />
            </td>

            <td>
                <button
                    className="btn-edit"
                    onClick={handleEdit}
                >
                    Edit
                </button>
            </td>
        </tr>
    );
};

export default ListProductItem;
