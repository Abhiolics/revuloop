import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { env } from "@/lib/env"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- Admin Route Protection ---
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLogin = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute) {
    // Check our custom signed 10-minute session cookie
    const sessionCookie = request.cookies.get('admin_session')
    
    let hasValidSessionCookie = false
    
    if (sessionCookie) {
      const parts = sessionCookie.value.split('.')
      if (parts.length === 2) {
        const expiresAt = parseInt(parts[0])
        // Basic expiration check (Signature is checked securely on server actions, but for middleware expiration is enough to redirect)
        if (Date.now() < expiresAt) {
          hasValidSessionCookie = true
        }
      }
    }

    if (!isAdminLogin) {
      if (!hasValidSessionCookie) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        // Clear invalid cookie
        const response = NextResponse.redirect(url)
        response.cookies.delete('admin_session')
        return response
      }
    } else {
      // If they are visiting /admin/login and already have a valid session, redirect to /admin
      if (hasValidSessionCookie) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    }
  }

  // --- Standard Route Protection ---
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/onboarding')
                           
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/sign-up')
                      
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
