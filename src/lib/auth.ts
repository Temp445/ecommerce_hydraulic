import jwt from "jsonwebtoken";

export function verifyAuthToken(authHeader: string | null) {
  if (!authHeader) return null;

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload as { userId: string; iat?: number; exp?: number };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
