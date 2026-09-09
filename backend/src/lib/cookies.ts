import type { CookieOptions, Response } from "express";

export type AuthClient = "storefront" | "dashboard";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const STOREFRONT_REFRESH_TOKEN_COOKIE = "storefrontRefreshToken";
export const DASHBOARD_REFRESH_TOKEN_COOKIE = "dashboardRefreshToken";

const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

export const getRefreshCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === "production";
  const secure = process.env.COOKIE_SECURE === "true" || isProduction;

  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: sevenDaysMs,
    // The refresh endpoint lives under /api/auth, while the client may call
    // other API routes before the next refresh. Keeping the cookie scoped to
    // the API root avoids browsers dropping it when the API base path changes.
    path: "/api",
  };
};

export const getRefreshTokenCookieName = (client: AuthClient): string => client === "dashboard" ? DASHBOARD_REFRESH_TOKEN_COOKIE : STOREFRONT_REFRESH_TOKEN_COOKIE;

export const setRefreshTokenCookie = (res: Response, token: string, client: AuthClient): void => {
  res.cookie(getRefreshTokenCookieName(client), token, getRefreshCookieOptions());
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, getRefreshCookieOptions());
  res.clearCookie(STOREFRONT_REFRESH_TOKEN_COOKIE, getRefreshCookieOptions());
  res.clearCookie(DASHBOARD_REFRESH_TOKEN_COOKIE, getRefreshCookieOptions());
  // Remove cookies created by older builds that used the narrower path.
  res.clearCookie(REFRESH_TOKEN_COOKIE, { ...getRefreshCookieOptions(), path: "/api/auth" });
};
