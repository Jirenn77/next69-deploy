import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Define admin routes
  const adminRoutes = ['/home', '/employeeM', '/branchM', '/customers', '/profiles', 
                       '/roles', '/servicegroup', '/membership-report', '/archivees'];
  
  // Define receptionist routes  
  const receptionistRoutes = ['/home2', '/customer-home', '/invoices', '/serviceorder', 
                              '/servicess', '/membership'];
  
  // Get auth token from cookie
  const authToken = request.cookies.get('auth-token')?.value;
  const isAuthenticatedCookie = request.cookies.get('isAuthenticated')?.value;
  
  // Check if user is authenticated
  const isAuthenticated = !!authToken || isAuthenticatedCookie === 'true';
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // For protected routes, we need to check authentication
  
  // Check if route is admin-only
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isReceptionistRoute = receptionistRoutes.some(route => pathname.startsWith(route));
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Additional checks can be added here for role-based access
  // For now, we'll allow access if authenticated
  
  // Add no-cache headers to prevent browser caching of protected pages
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.woff|.*\\.woff2).*)',
  ],
};
