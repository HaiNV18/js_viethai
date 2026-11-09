import { getDb } from "@/lib/mongodb";
import Link from "next/link";

export const instant = false; // Cho phép truy vấn DB động không chặn static prerender trong Next.js 16

export default async function ListProductPage() {
    const db = await getDb();
    const listProduct = await db.collection("products").find({}).toArray();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Danh sách sản phẩm</h2>
                <p className="text-sm text-zinc-500">
                    Tổng cộng: {listProduct.length} sản phẩm
                </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
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
                            {listProduct.map((p) => {
                                const isAvailable = (p.qty ?? 0) > 0;
                                const statusText = p.status ?? (isAvailable ? "Còn hàng" : "Hết hàng");

                                return (
                                    <tr key={p._id.toString()} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                                        <td className="py-3.5 font-medium">{p.code}</td>
                                        <td className="py-3.5 text-zinc-500">{p.title_prod}</td>
                                        <td className="py-3.5 font-semibold">
                                            {typeof p.price === "number"
                                                ? `${p.price.toLocaleString("vi-VN")} đ`
                                                : p.price}
                                        </td>
                                        <td className="py-3.5">{p.qty}</td>
                                        <td className="py-3.5">
                                            <span
                                                className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                                                    isAvailable
                                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                                                }`}
                                            >
                                                {statusText}
                                            </span>
                                        </td>
                                        <td className="py-3.5">
                                            <Link
                                                href={`/admin/detail-product/${p.code}`}
                                                className="inline-block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
