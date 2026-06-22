import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  applyCookies,
  createMiddlewareClient,
} from "@/lib/supabase/middleware";
import {
  TENANT_HEADER_ID,
  TENANT_HEADER_PUBLIC_KEY,
  TENANT_HEADER_SLUG,
} from "@/lib/tenant/constants";
import { lookupTenantEdge } from "@/lib/tenant/lookup-edge";
import { requiresAuth, requiresTenant } from "@/lib/tenant/paths";
import { resolveTenantFromRequest } from "@/lib/tenant/resolve";

function applyTenantHeaders(
  request: NextRequest,
  tenant: { id: string; slug: string; publicKey: string },
): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(TENANT_HEADER_ID, tenant.id);
  requestHeaders.set(TENANT_HEADER_SLUG, tenant.slug);
  requestHeaders.set(TENANT_HEADER_PUBLIC_KEY, tenant.publicKey);
  return requestHeaders;
}

function applyResolutionHeaders(
  request: NextRequest,
  resolution: NonNullable<ReturnType<typeof resolveTenantFromRequest>>,
): Headers {
  const requestHeaders = new Headers(request.headers);

  if (resolution.kind === "slug") {
    requestHeaders.set(TENANT_HEADER_SLUG, resolution.value);
  } else {
    requestHeaders.set(TENANT_HEADER_PUBLIC_KEY, resolution.value);
  }

  return requestHeaders;
}

function redirectWithCookies(
  url: URL,
  cookies: Parameters<typeof applyCookies>[1],
): NextResponse {
  const response = NextResponse.redirect(url);
  return applyCookies(response, cookies);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pendingCookies: Parameters<typeof applyCookies>[1] = [];

  const supabase = createMiddlewareClient(request, (cookies) => {
    pendingCookies.push(...cookies);
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (requiresAuth(pathname) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return redirectWithCookies(loginUrl, pendingCookies);
  }

  if (pathname === "/login" && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return redirectWithCookies(dashboardUrl, pendingCookies);
  }

  if (!requiresTenant(pathname)) {
    const response = NextResponse.next({ request });
    return applyCookies(response, pendingCookies);
  }

  const resolution = resolveTenantFromRequest(request);

  if (!resolution) {
    return new NextResponse("Tenant not found", { status: 404 });
  }

  const tenant = await lookupTenantEdge(resolution);

  const requestHeaders = tenant
    ? applyTenantHeaders(request, tenant)
    : applyResolutionHeaders(request, resolution);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return applyCookies(response, pendingCookies);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
