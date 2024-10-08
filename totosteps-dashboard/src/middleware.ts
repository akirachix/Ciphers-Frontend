import { NextResponse } from "next/server";
import { getCookie } from "cookies-next";



export function middleware(req: Request) {
    const isloggedIn = getCookie('isLoggedIn' , {req});

    if (isloggedIn === 'true') {
        return NextResponse.redirect(new URL ('/homepage', req.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/sign-up'],
};