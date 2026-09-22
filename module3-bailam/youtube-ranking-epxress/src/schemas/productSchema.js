import * as yup from "yup";

const createProductSchema = yup.object({
    title: yup.string().min(1, "Tên không được rỗng").required(),
    price: yup.number().positive("Giá phải lớn hơn 0").required(),
    category: yup.string().oneOf(["phone", "laptop", "tablet"]).required(),
    stock: yup.number().integer().min(0).required(),
});

export default createProductSchema;
