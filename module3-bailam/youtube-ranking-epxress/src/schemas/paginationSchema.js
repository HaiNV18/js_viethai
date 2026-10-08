import * as yup from "yup";

export const paginationSchema = yup.object({
    page:  yup.number().integer().min(1).default(1),
    limit: yup.number().integer().min(1).max(100).default(10),
});

export default paginationSchema;
