// app\(admin)\middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const adminCookie = request.cookies.get("AdminVerified");


    if (!adminCookie || adminCookie.value !== "True") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
