import { NextResponse } from 'next/server'
import { checkExpired } from './utils/auth'

const protectedRoutes = ['/events', '/profile', 'settings', '/attendance']
const isAuthenticated = checkExpired()
export default function middleware(req) {
    if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
        const absoluteURL = new URL('/', req.nextUrl.origin)
        return NextResponse.redirect(absoluteURL.toString())
    }
}
