import { useEffect, useMemo, useState } from "react";
import userService from "../../../services/userService";
import "./ListUsers.css";

const ITEMS_PER_PAGE = 5;

const ListUsers = () => {
    // 1. Khai báo State chứa danh sách User lấy từ API
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // State Filter and Pagination
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    // Gọi API lấy danh sách User khi Component vừa Mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await userService.getUsers();

                console.log(res);

                if (res.success && res.data) {
                    setUsers(res.data);
                }
            } catch (err) {
                console.error("Lỗi lấy danh sách User:", err);
                const msg = err.response?.data?.message || "Không thể tải danh sách người dùng.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesKeyword =
                user.username?.toLowerCase().includes(searchKeyword.trim().toLowerCase()) ||
                user.email?.toLowerCase().includes(searchKeyword.trim().toLowerCase());

            const matchesRole =
                filterRole === "all" || user.role?.toUpperCase() === filterRole.toUpperCase();

            return matchesKeyword && matchesRole;
        });
    }, [users, searchKeyword, filterRole]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Giao diện khi đang tải dữ liệu hoặc gặp lỗi
    if (loading) return <div className="p-4 text-center">Đang tải danh sách người dùng...</div>;
    if (error) return <div className="p-4 text-danger text-center">{error}</div>;

    return (
        <div className="list-product">
            <h2>Quản lý người dùng</h2>

            <div className="filter-product">
                <input
                    type="text"
                    placeholder="Tìm theo Username hoặc Email..."
                    value={searchKeyword}
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <select
                    className="form-select"
                    value={filterRole}
                    onChange={(e) => {
                        setFilterRole(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">Tất cả vai trò</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                </select>
            </div>

            {/* Bảng danh sách User */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Họ và Tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td><strong>{user.username}</strong></td>
                                <td>{user.lastname} {user.firstname}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || "Chưa cập nhật"}</td>
                                <td>
                                    <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                                        {user.role}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">Không tìm thấy người dùng nào</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-sm btn-outline-primary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Previous
                    </button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button
                        className="btn btn-sm btn-outline-primary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListUsers;
