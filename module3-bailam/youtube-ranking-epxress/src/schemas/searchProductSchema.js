import * as yup from "yup";

const searchProductSchema = yup.object({
    sort: yup.string().oneOf(["price", "name", "createdAt"], "Trường sắp xếp không hợp lệ").optional(),

    order: yup.string().oneOf(["asc", "desc"], "Thứ tự sắp xếp phải là 'asc' hoặc 'desc'").default("asc"),

    category: yup.string().trim().optional(),

    minPrice: yup.number().typeError("minPrice phải là số").min(0, "minPrice không được nhỏ hơn 0").optional(),

    maxPrice: yup.number().typeError("maxPrice phải là số").min(0, "maxPrice không được nhỏ hơn 0")
                .when("minPrice", (minPrice, schema) =>
                    minPrice !== undefined && !isNaN(minPrice)
                        ? schema.min(minPrice, "maxPrice phải lớn hơn hoặc bằng minPrice")
                        : schema
                )
                .optional(),
});

export default searchProductSchema;
