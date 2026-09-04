import { useReducer } from 'react';

import cartReducer, {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    INCREASE_QUANTITY,
    DECREASE_QUANTITY
} from '../../../reducer/cartReducer.jsx';

const initialState = [];

function ShoppingCartApp() {
    const [cart, dispatch] = useReducer(cartReducer, initialState);

    const handleAdd = (product) => {
        dispatch({ type: ADD_TO_CART, payload: product });
    };

    const handleRemove = (id) => {
        dispatch({ type: REMOVE_FROM_CART, payload: id });
    };

    return (
        <div>
            <h3>Giỏ hàng của bạn ({cart.length})</h3>
            {cart.map(item => (
                <div key={item.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                    <span>{item.name} - SL: {item.quantity}</span>
                    <button onClick={() => dispatch({
                        type: INCREASE_QUANTITY,
                        payload: { id: item.id, amount: 1 }
                    })}> + </button>
                    <button onClick={() => dispatch({
                        type: DECREASE_QUANTITY,
                        payload: { id: item.id, amount: 1 }
                    })}> - </button>
                    <button onClick={() => handleRemove(item.id)}>Xóa</button>
                </div>
            ))}
            <hr />
            <button onClick={() => handleAdd({ id: 1, name: 'iPhone 15 Pro Max' })}>
                Thêm iPhone vào giỏ
            </button>
        </div>
    );
}

export default ShoppingCartApp;