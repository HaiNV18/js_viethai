// localStorage.clear();

function addToCart(index, qty) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Lấy giỏ hàng lúc đầu

    // Kiểm tra số lượng ban đầu.
    let countQty = products[index].qty;
    console.log(cart)
    console.log(index)
    
    if (countQty == undefined || countQty == null) {
        countQty = 0;
    }
    products[index].qty = countQty + qty;

    // Kiểm tra tồn tại
    let isExist = false;
    cart.forEach(item => {
        if (item.id == products[index].id) {
            item.qty = item.qty + 1;
            isExist = true;
        }
    });

    if (isExist == false) {
        cart.push(products[index]); // thêm vào giỏ hàng
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // cập nhật giỏ hàng trong localStorage

    updateCartCount(); // update số lượng

    alert("Đã thêm vào giỏ hàng!");
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;
    cart.forEach(item => {
        total = total + item.qty;
    });

    document.querySelector(".badge").innerText = total; 
}
