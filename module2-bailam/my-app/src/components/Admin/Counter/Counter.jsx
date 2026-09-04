import { useReducer } from 'react';

const countReducer = (state, action) => {
    switch (action.type) {
        case 'UP': return state + 1;
        case 'DOWN': return state - 1;
        case 'RESET': return 0;
        default: return state;
    }
};

function Counter() {
    const [count, dispatch] = useReducer(countReducer, 0);

    return (
        <div>
            <h1>{count}</h1>
            <button onClick={() => dispatch({ type: 'UP' })}>Tăng</button>
            <button onClick={() => dispatch({ type: 'DOWN' })}>Giảm</button>
            <button onClick={() => dispatch({ type: 'RESET' })}>RESET về 0</button>
        </div>
    );
}

export default Counter;