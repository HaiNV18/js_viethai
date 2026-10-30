export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const DECREASE_QUANTITY = 'DECREASE_QUANTITY';

function cartReducer(state, action) {
    switch (action.type) {
        case ADD_TO_CART:
            // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
            const existingProduct = state.find(item => item.id === action.payload.id);

            if (existingProduct) {
                // Nếu có rồi: Trả về mảng mới với sản phẩm đó được tăng số lượng (Immutability)
                return state.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Nếu chưa có: Thêm sản phẩm mới vào mảng
            return [...state, { ...action.payload, quantity: 1 }];

        case REMOVE_FROM_CART:
            // Lọc bỏ sản phẩm có ID được gửi lên
            return state.filter(item => item.id !== action.payload);

        case INCREASE_QUANTITY:
            // Cập nhật số lượng dựa trên ID và giá trị tăng/giảm
            return state.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.max(1, item.quantity + action.payload.amount) }
                    : item
            );
            
        case DECREASE_QUANTITY:
            // Cập nhật số lượng dựa trên ID và giá trị tăng/giảm
            return state.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.max(1, item.quantity - action.payload.amount) }
                    : item
            );

        default:
            return state;
    }
}

export default cartReducer;