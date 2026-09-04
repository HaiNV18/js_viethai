import React from 'react';

const Child = React.memo(({ onAction }) => {
    console.log("Child KHÔNG render nữa. Tối ưu thành công!");
    return <button onClick={onAction}>Click me</button>;
});

export default Child;