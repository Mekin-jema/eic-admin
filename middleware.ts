import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_PATH = '/admin'
const LOGIN_PATH = '/login'
const LEGACY_ADMIN_LOGIN = '/admin/login'

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const token = req.cookies.get('admin_token')?.value
  const isAdminRoute = pathname.startsWith(ADMIN_PATH)
  const isLogin = pathname === LOGIN_PATH

  // Support old /admin/login link by redirecting to /login
  if (pathname === LEGACY_ADMIN_LOGIN) {
    const url = req.nextUrl.clone()
    url.pathname = LOGIN_PATH
    return NextResponse.redirect(url)
  }

  // Handle login page: if already authenticated, go to next or /admin
  if (isLogin) {
    if (token) {
      const redirectTo = searchParams.get('next') || ADMIN_PATH
      const url = req.nextUrl.clone()
      url.pathname = redirectTo
      url.search = ''
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Protect admin routes
  // if (isAdminRoute) {
  //   if (!token) {
  //     const url = req.nextUrl.clone()
  //     url.pathname = LOGIN_PATH
  //     url.searchParams.set('next', pathname)
  //     return NextResponse.redirect(url)
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
