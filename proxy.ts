import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/projects', '/account']
const publicRoutes = ['/login', '/signup']

export default function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some((route) =>
        path.startsWith(route)
    )
    const isPublicRoute = publicRoutes.some((route) => path === route)

    const token = req.cookies.get('session')?.value

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}