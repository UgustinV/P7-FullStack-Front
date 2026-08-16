import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'
 
// Définit les routes protégées et publiques
const protectedRoutes = ['/dashboard', '/account', '/projects']
const publicRoutes = ['/login', '/signup', '/']
 
export default async function proxy(req: NextRequest) {
    // Vérifie si la route demandée est protégée ou publique
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)
    
    // Décrypte la session à partir du cookie
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    // Redirige vers /login si l'utilisateur n'est pas authentifié
    if (isProtectedRoute && !session?.token) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    
    // Redirige vers /dashboard si l'utilisateur est authentifié
    if (
        isPublicRoute &&
        session?.token &&
        !req.nextUrl.pathname.startsWith('/dashboard')
    ) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
    
    return NextResponse.next()
}
 
// Routes sur lesquelles le proxy ne doit pas s'exécuter (regex)
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}