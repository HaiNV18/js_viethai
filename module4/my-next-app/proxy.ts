import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "@/lib/jwt";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Chuyển hướng trang chủ "/" về "/login"
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Bảo vệ các route bắt đầu bằng /admin
    if (pathname.startsWith("/admin")) {
        const token = request.cookies.get("token")?.value;
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (token) {
            const payload = await verifyAccessToken(token);
            if (payload) {
                // Kiểm tra quyền ADMIN nếu truy cập vào /admin/users
                if (pathname.startsWith("/admin/users") && payload.role !== "ADMIN") {
                    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
                }

                return NextResponse.next(); // Token hợp lệ & đúng quyền -> cho phép đi tiếp
            }
        }

        if (refreshToken) {
            const refreshPayload = await verifyRefreshToken(refreshToken);
            if (refreshPayload) {
                // Tạo lại Access Token mới (thời hạn 1 phút)
                const newAccessToken = await signAccessToken({
                    id: refreshPayload.id,
                    firstname: refreshPayload.firstname,
                    lastname: refreshPayload.lastname,
                    username: refreshPayload.username,
                    role: refreshPayload.role,
                });

                // Kiểm tra quyền ADMIN nếu truy cập vào /admin/users lúc vừa refresh token
                const response =
                    pathname.startsWith("/admin/users") && refreshPayload.role !== "ADMIN"
                        ? NextResponse.redirect(new URL("/admin/dashboard", request.url))
                        : NextResponse.next();

                response.cookies.set("token", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60, // 1 phút
                    path: "/",
                });

                return response;
            }
        }

        // Không có token hợp lệ -> chuyển hướng về trang đăng nhập
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
