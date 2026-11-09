import { SignJWT, jwtVerify } from "jose";

export interface UserPayload {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    role: string;
}

const accessSecret = new TextEncoder().encode(
    process.env.JWT_ACCESS_SECRET || "default_access_secret_key"
);
const refreshSecret = new TextEncoder().encode(
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret_key"
);

export async function signAccessToken(payload: UserPayload) {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1m") // 1 phút
        .sign(accessSecret);
}

export async function signRefreshToken(payload: UserPayload) {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // 7 ngày
        .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<UserPayload | null> {
    try {
        const { payload } = await jwtVerify(token, accessSecret);
        return payload as unknown as UserPayload;
    } catch {
        return null; // Hết hạn hoặc không hợp lệ
    }
}

export async function verifyRefreshToken(token: string): Promise<UserPayload | null> {
    try {
        const { payload } = await jwtVerify(token, refreshSecret);
        return payload as unknown as UserPayload;
    } catch {
        return null; // Hết hạn hoặc không hợp lệ
    }
}
