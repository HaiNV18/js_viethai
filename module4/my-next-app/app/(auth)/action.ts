"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { signAccessToken, signRefreshToken, UserPayload } from "@/lib/jwt";

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    let isSuccess = false;

    try {
        const db = await getDb();
        const account = await db.collection("accounts").findOne({ username });

        if (!account) {
            return { error: "Tài khoản hoặc mật khẩu không chính xác" };
        }

        const isPasswordValid =
            account.password.startsWith("$2")
                ? await bcrypt.compare(password, account.password)
                : password === account.password;

        if (!isPasswordValid) {
            return { error: "Tài khoản hoặc mật khẩu không chính xác" };
        }

        const userPayload: UserPayload = {
            id: account._id.toString(),
            firstname: account.firstname,
            lastname: account.lastname,
            username: account.username,
            role: account.role,
        };

        const accessToken = await signAccessToken(userPayload);
        const refreshToken = await signRefreshToken(userPayload);

        const cookieStore = await cookies();

        // Save Access Token
        cookieStore.set("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60, // 1 phút
            path: "/",
        });

        // Save Refresh Token
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        // Save user information for Client/Server to read and display the interface
        cookieStore.set("user", JSON.stringify(userPayload), {
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        isSuccess = true;
    } catch (error) {
        console.error(error);
        return { error: "Không thể kết nối đến máy chủ. Vui lòng thử lại!" };
    }

    if (isSuccess) {
        redirect("/admin/dashboard");
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("refreshToken");
    cookieStore.delete("user");
    redirect("/login");
}
