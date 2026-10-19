"use client"

import { useRouter } from "next/navigation";

export default function ListProductPage() {
    const router = useRouter();

    const listProduct = [
        { id: "ORD-001", product: "iPhone 15 Pro", price: "$1,099", qty: 99, status: "Hoàn thành" },
        { id: "ORD-002", product: "MacBook Air M3", price: "$1,299", qty: 99, status: "Đang xử lý" },
        { id: "ORD-003", product: "AirPods Pro 2", price: "$249", qty: 99, status: "Hoàn thành" },
        { id: "ORD-004", product: "iPad Pro", price: "$799", qty: 99, status: "Đã hủy" },
    ];

    const handleEdit = (id: string) => {
        console.log(id)
        router.push("/admin/detail-product/" + id);
    }

    return (
        <div className="space-y-6">
            {/* Tiêu đề trang */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Danh sách sản phẩm</h2>
                <p className="text-sm text-zinc-500"></p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4"></h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs uppercase">
                            <tr>
                                <th className="pb-3 font-semibold">Mã sản phẩm</th>
                                <th className="pb-3 font-semibold">Tên sản phẩm</th>
                                <th className="pb-3 font-semibold">Giá tiền</th>
                                <th className="pb-3 font-semibold">Số lượng</th>
                                <th className="pb-3 font-semibold">Trạng thái</th>
                                <th className="pb-3 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {listProduct.map((p) => (
                                <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                                    <td className="py-3.5 font-medium">{p.id}</td>
                                    <td className="py-3.5 text-zinc-500">{p.product}</td>
                                    <td className="py-3.5 font-semibold">{p.price}</td>
                                    <td className="py-3.5">{p.qty}</td>
                                    <td className="py-3.5">
                                        <span
                                            className={`px-2.5 py-1 text-xs rounded-full font-medium ${p.status === "Hoàn thành"
                                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                    : p.status === "Đang xử lý"
                                                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                                                }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5">
                                        <button
                                            onClick={() => handleEdit(p.id)}
                                            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
