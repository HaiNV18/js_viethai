import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import "./Ranking.css";

function Ranking() {
    return (
        <div className="bg-light min-vh-100 pb-5">
            <Header />

            <Outlet />
        </div>
    );
}

export default Ranking;
