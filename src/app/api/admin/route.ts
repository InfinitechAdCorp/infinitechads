import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const response = NextResponse.json({ success: true });

        response.headers.set(
            "Set-Cookie",
            `AdminVerified=True; HttpOnly; Secure; Path=/; SameSite=Strict`
        );

        return response;
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
}
