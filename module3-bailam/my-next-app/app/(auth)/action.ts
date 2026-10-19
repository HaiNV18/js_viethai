"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// prevState dùng để hứng state trước đó khi kết hợp với useActionState
export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    let isSuccess = false;

    try {
        const res = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                expiresInMins: 60,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { error: data.message || "Tài khoản hoặc mật khẩu không chính xác" };
        }

        // Lưu token vào HttpOnly Cookie
        // Cách này an toàn hơn localStorage
        // Lưu ý Next.js 16: cookies() là hàm bất đồng bộ (phải có await)
        const cookieStore = await cookies();
        cookieStore.set("token", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60, // 1 giờ
            path: "/",
        });

        // Lưu thêm thông tin user cơ bản
        cookieStore.set("user", JSON.stringify({
            id: data.id,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
        }), {
            path: "/",
            maxAge: 60 * 60,
        });

        isSuccess = true;
    } catch (error: any) {
        return { error: "Không thể kết nối đến máy chủ. Vui lòng thử lại!" };
    }

    // Call redirect() ngoài try-catch
    if (isSuccess) {
        redirect("/admin/dashboard");
    }
}
