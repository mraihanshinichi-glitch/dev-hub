import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Handle redirects based on auth state and current path
    const url = request.nextUrl.clone()
    const isAuthPage = url.pathname.startsWith('/auth/')
    const isDashboard = url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/project/')
    const isHomePage = url.pathname === '/'

    // If user is logged in and on auth pages, redirect to dashboard
    if (user && isAuthPage) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // If user is logged in and on homepage, redirect to dashboard
    if (user && isHomePage) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // If user is not logged in and trying to access protected pages, redirect to login
    if (!user && isDashboard) {
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

  } catch (error) {
    console.error('Middleware auth error:', error)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}