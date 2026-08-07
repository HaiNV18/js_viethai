import { useState } from "react";
import Login from "../Login/Login";
import Register from "../Register/Register";
import "./Auth.css";

function Auth() {

    // Dựa vào route, hiển thị Login, Register, ForgotPassword

    return (
        <div>
            <Register />
        </div>
    );
}

export default Auth;
