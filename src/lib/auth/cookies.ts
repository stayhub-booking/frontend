import "server-only";

import { cookies } from "next/headers";

type TokenData = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export async function saveAuthCookies(tokens: TokenData) {
  const cookieStore = await cookies();

  const commonOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };

  cookieStore.set("stayhub_access_token", tokens.accessToken, {
    ...commonOptions,
    path: "/",
    maxAge: tokens.expiresIn,
  });

  cookieStore.set("stayhub_refresh_token", tokens.refreshToken, {
    ...commonOptions,
    path: "/api/auth",
  });
}
