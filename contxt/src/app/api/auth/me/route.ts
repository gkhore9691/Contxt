import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ user: null })
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        plan: users.plan,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
