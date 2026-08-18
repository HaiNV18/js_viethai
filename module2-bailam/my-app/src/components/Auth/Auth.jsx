import { Outlet } from "react-router-dom";

import "./Auth.css"

function Auth() {
    return (
        <div className="auth">
            <Outlet />
        </div>
    );
}

export default Auth;
