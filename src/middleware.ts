// /middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Clave para almacenamiento del token - Exactamente la misma que en el AuthProvider
const TOKEN_KEY = '@creditoya:token';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    console.log(`Middleware verificando ruta: ${pathname}`);

    // Si es una ruta pública o login, permitir acceso
    if (pathname === '/' || pathname === '/login' || pathname.startsWith('/auth/')) {
        console.log('Middleware: Ruta pública, permitiendo acceso');
        return NextResponse.next();
    }

    // Verificar si la ruta actual está protegida
    const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

    // Para rutas protegidas, verificar autenticación
    if (isDashboardRoute) {
        console.log('Middleware: Ruta protegida de dashboard detectada');

        // Obtener la cookie correctamente
        // En Next.js 15.x, debes usar request.cookies.get
        const token = request.cookies.get(TOKEN_KEY)?.value;
        console.log(`Middleware: Token presente: ${!!token}`);

        // Si no hay token, redirigir a login
        if (!token) {
            console.log('Middleware: No se encontró token, redirigiendo a login');
            return NextResponse.redirect(new URL('/', request.url));
        }

        try {
            // Verificar si el token es válido
            const decoded = jwtDecode<{exp: number}>(token);
            const currentTime = Date.now() / 1000;

            console.log(`Middleware: Expiración del token: ${new Date(decoded.exp * 1000).toISOString()}`);
            console.log(`Middleware: Hora actual: ${new Date(currentTime * 1000).toISOString()}`);
            console.log(`Middleware: Token válido: ${decoded.exp > currentTime}`);

            if (decoded.exp < currentTime) {
                console.log('Middleware: Token expirado, redirigiendo a login');
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Token válido, permitir acceso
            console.log('Middleware: Token válido, permitiendo acceso al dashboard');
            return NextResponse.next();
        } catch (error) {
            console.log('Middleware: Error al validar token', error);
            // Error al decodificar, token inválido
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Para cualquier otra ruta no especificada, permitir acceso
    console.log('Middleware: Ruta no especificada, permitiendo acceso');
    return NextResponse.next();
}

// Configurar el middleware para ejecutarse en rutas específicas
export const config = {
    matcher: [
        '/dashboard',
        '/dashboard/:path*'
    ],
};