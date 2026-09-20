// middleware/validate.js
import { ValidationError } from "yup";

export function validate(schema) {
    return async (req, res, next) => {
        try {
            // abortEarly: false → báo TẤT CẢ lỗi cùng lúc, không dừng ở lỗi đầu tiên
            req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
            next();
        } catch (err) {
            if (err instanceof ValidationError) {
                res.status(400).json({
                    success: false,
                    message: "Dữ liệu không hợp lệ",
                    errors: err.inner.map((e) => ({
                        field: e.path,
                        message: e.message,
                    })),
                });
                return;
            }
            next(err);
        }
    };
}
