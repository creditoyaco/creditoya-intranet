// /middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Clave para almacenamiento del token - Exactamente la misma que en el AuthProvider
const TOKEN_KEY = '@creditoya:token';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // Si es una ruta pública o login, permitir acceso
    if (pathname === '/' || pathname === '/login' || pathname.startsWith('/auth/')) {
        return NextResponse.next();
    }
    
    // Verificar si la ruta actual está protegida
    const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
    
    // Para rutas protegidas, verificar autenticación
    if (isDashboardRoute) {
        // Obtener y verificar la cookie
        const tokenCookie = request.cookies.get(TOKEN_KEY);
        
        // Debug: Añadir cabeceras para verificar estado de autenticación
        const response = NextResponse.next();
        response.headers.set('x-debug-has-cookie', tokenCookie ? 'true' : 'false');
        
        // Si no hay token, redirigir a login
        if (!tokenCookie || !tokenCookie.value) {
            console.log('Middleware: No token encontrado, redirigiendo a login');
            const loginUrl = new URL('/', request.url);
            return NextResponse.redirect(loginUrl);
        }
        
        try {
            // Verificar si el token es válido
            const token = tokenCookie.value;
            const decoded = jwtDecode<{exp: number}>(token);
            const currentTime = Date.now() / 1000;
            
            response.headers.set('x-debug-token-valid', decoded.exp > currentTime ? 'true' : 'false');
            response.headers.set('x-debug-token-expires', new Date(decoded.exp * 1000).toISOString());
            
            if (decoded.exp < currentTime) {
                console.log('Middleware: Token expirado, redirigiendo a login');
                const loginUrl = new URL('/', request.url);
                return NextResponse.redirect(loginUrl);
            }
            
            // Token válido, permitir acceso
            return response;
        } catch (error) {
            console.log('Middleware: Error al validar token', error);
            // Error al decodificar, token inválido
            const loginUrl = new URL('/', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }
    
    // Para cualquier otra ruta no especificada, permitir acceso
    return NextResponse.next();
}

// Configurar el middleware para ejecutarse en rutas específicas
export const config = {
    matcher: [
        '/dashboard',
        '/dashboard/:path*'
    ],
};