import { NextResponse } from 'next/server'
import { checkExpired } from './utils/auth'
import Cookies from 'js-cookie'

const protectedRoutes = ['/events', '/profile', '/settings', '/attendance']

export default function middleware(req) {
    // const authCookie = req.cookies.get('isAuthenticated')
    // const isAuthenticated = authCookie === 'true' && !checkExpired()
    // if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    //     return NextResponse.redirect(new URL('/', req.nextUrl.origin))
    // }
}
