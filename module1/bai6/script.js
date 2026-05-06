function pheptinh(pt) {

    let a = Number(document.getElementById("giatriA").value);
    let b = Number(document.getElementById("giatriB").value);
    
    // int là số nguyên. -1 0 1 2 3 4
    // float là số thập phân 1.234
    // a = parseInt(a); // convert string to integer
    // b = parseInt(b);

    var ketqua = null;

    if (pt == 'cong') {
        ketqua = a + b;
    }
    else if (pt == 'tru') {
        ketqua = a - b;
    }
    else if (pt == 'nhan') {
        ketqua = a * b;
    }
    else if (pt == 'chia') {
        if (b == 0) {
            document.getElementById("ketqua").innerHTML = "b không được bằng 0";
            return; // kết thúc hàm
        } else {
            ketqua = a / b;
        }
    }
    document.getElementById("ketqua").innerHTML = ketqua;
}







// function test(){
//     let age = 20;
//     console.log(age);
// }
// test();
// console.log(age);


// let cars = [];
// cars[0]= "Saab";
// cars[1]= "Volvo";
// cars[3]= "BMW";

// console.log(cars);
// console.log(cars.reverse());

// for (let i = cars.length - 1; i >= 0; i--) {
//     console.log(cars[i]);
// }

// Câu hỏi pv gameloft
// Cho 1 mảng, hãy cho kết quả từ cuối lên đầu









// var case1 = 1 + 2 + 'a';
// var case2 = 1 + 2 + 'a' + 3 + 4 + 'b';
// var case3 = 1 + 'a' + 2 + 3;
// console.log("case1: " + case1);
// console.log("case2: " + case2);
// console.log("case3: " + case3);

// // So sánh giá trị
// if (1 == '1') {
//     console.log(true);
// } else {
//     console.log(false);
// }

// // So sánh kiểu dữ liệu
// if (1 === '1') {
//     console.log(true);
// } else {
//     console.log(false);
// }

// var a = 1; 
// var b = 0;
// if (b == 0) {
//     console.log("Không thể chia cho 0");
// } else {
//     var result = a / b;
//     console.log("Kết quả: " + result);
// }

// var a = 1;
// var b = 2;
// var pheptinh = 'chia';
// var ketqua = null;
// if (pheptinh == 'cong') {
//     ketqua = a + b;
// }
// else if (pheptinh == 'tru') {
//     ketqua = a - b;
// }
// else if (pheptinh == 'nhan') {
//     ketqua = a * b;
// }
// else if (pheptinh == 'chia') {
//     if (b == 0) {
//         console.log("b không được bằng 0");
//     } else {
//         ketqua = a / b;
//     }
// }
// console.log(ketqua);