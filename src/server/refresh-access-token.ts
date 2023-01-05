import { env } from "@/env/server.mjs";
import { z } from "zod";

const refreshResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
});

export async function refreshAccessToken(refreshToken: string) {
  const url =
    "https://oauth2.googleapis.com/token?" +
    new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const refreshedTokens = await response.json();

  if (!response.ok) {
    throw refreshedTokens;
  }

  const safeTokens = refreshResponse.safeParse(refreshedTokens);

  if (!safeTokens.success) {
    throw new Error(
      `Invalid refresh_token response: ${safeTokens.error.message}`
    );
  }

  return {
    access_token: safeTokens.data.access_token,
    expires_at: Date.now() + safeTokens.data.expires_in * 1000,
    refresh_token: safeTokens.data.refresh_token ?? refreshToken, // Fall back to old refresh token
  };
}
