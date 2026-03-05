import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret'
const TOKEN_NAME = 'contxt-token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface JWTPayload {
  userId: string
  email: string
  username: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_NAME)?.value
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_NAME)
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthCookie()
  if (!token) return null
  return verifyToken(token)
}
