import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";

function Sidebar() {
    return (
        <aside className="sidebar">
            <ul className="menu">
                <li className="menu-item active">
                    <MdDashboard /> Dashboard
                </li>

                <li className="menu-item">
                    <FaRegUser /> Users
                </li>

                <li className="menu-item">
                    <MdOutlineSettings /> Settings
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
