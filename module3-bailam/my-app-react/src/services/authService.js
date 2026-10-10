import axios from "axios";

// const API_URL = "https://dummyjson.com";
const API_URL = "http://localhost:4000/api/v1";

const authService = {

    // API /api/v1/login
    login: async (username, password) => {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password,
        });
        return response.data;
    },

    // API /api/v1/forgot-password
    forgotPassword: async (email) => {
        const response = await axios.post(`${API_URL}/forgot-password`, {
            email,
        });
        return response.data;
    },
};

export default authService;
