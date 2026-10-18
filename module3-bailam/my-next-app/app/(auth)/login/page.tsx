"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("emilys");
    const [password, setPassword] = useState("emilyspass");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const res = await fetch("https://dummyjson.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    expiresInMins: 30,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Đăng nhập thất bại");
            }

            console.log("Dữ liệu trả về:", data);
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data));

            router.push("/admin/dashboard");
        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 text-center">
                Đăng nhập
            </h2>

            {errorMessage && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg">
                    {errorMessage}
                </div>
            )}

            {/* Input Username */}
            <div>
                <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Tên đăng nhập
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="Nhập username (vd: emilys)"
                />
            </div>

            {/* Input Password */}
            <div>
                <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Mật khẩu
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="Nhập password (vd: emilyspass)"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-4">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="font-semibold underline hover:text-black dark:hover:text-white">
                    Đăng ký ngay
                </Link>
            </div>
        </form>
    );
}
