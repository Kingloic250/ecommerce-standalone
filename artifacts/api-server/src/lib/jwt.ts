import { createHmac } from "crypto";

const SECRET = process.env.SESSION_SECRET ?? "shopwave-secret-key";

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

function base64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function signToken(payload: TokenPayload): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify({ ...payload, iat: Date.now() }));
  const sig = createHmac("sha256", SECRET)
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expected = createHmac("sha256", SECRET)
      .update(`${header}.${body}`)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(body, "base64").toString("utf-8")) as TokenPayload;
  } catch {
    return null;
  }
}
