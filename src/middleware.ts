import { NextResponse, type NextRequest } from 'next/server';

const AUTHENTICATION_PATHS = ['/signin', '/signup'];
const PUBLIC_FILE_PATTERN = /\.(.*)$/;
const PROTECTED_LISTING_PATH_PATTERN = /^\/listings\/[^/]+\/(edit)$/;

function isProtectedPathname(pathname: string): boolean {
  return pathname === '/listings/new' || pathname.startsWith('/profiles/') || PROTECTED_LISTING_PATH_PATTERN.test(pathname);
}

function isAuthPathname(pathname: string): boolean {
  return AUTHENTICATION_PATHS.includes(pathname);
}

function shouldIgnoreRequest(pathname: string): boolean {
  return pathname.startsWith('/_next') || pathname === '/favicon.ico' || PUBLIC_FILE_PATTERN.test(pathname);
}

function buildSignInRedirect(request: NextRequest): NextResponse {
  const signInUrl = new URL('/signin', request.url);
  signInUrl.searchParams.set('callbackUrl', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (shouldIgnoreRequest(pathname)) {
    return NextResponse.next();
  }

  if (isAuthPathname(pathname) && request.cookies.get('authjs.session-token')?.value) {
    return NextResponse.redirect(new URL(request.nextUrl.searchParams.get('callbackUrl') ?? '/', request.url));
  }

  if (!isProtectedPathname(pathname)) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('authjs.session-token')?.value ?? request.cookies.get('__Secure-authjs.session-token')?.value;
  if (sessionToken) {
    return NextResponse.next();
  }

  return buildSignInRedirect(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
