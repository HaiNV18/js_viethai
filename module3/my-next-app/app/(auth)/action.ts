"use server";

import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    // Xử lý xác thực...


    redirect("/dashboard");
}
