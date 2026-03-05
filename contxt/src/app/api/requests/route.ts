import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packRequests, users } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { eq, desc, isNull } from 'drizzle-orm'

export async function GET() {
  try {
    const results = await db
      .select({
        id: packRequests.id,
        title: packRequests.title,
        description: packRequests.description,
        upvoteCount: packRequests.upvoteCount,
        claimedBy: packRequests.claimedBy,
        fulfilledPackId: packRequests.fulfilledPackId,
        createdAt: packRequests.createdAt,
        authorUsername: users.username,
      })
      .from(packRequests)
      .innerJoin(users, eq(packRequests.userId, users.id))
      .orderBy(desc(packRequests.upvoteCount))
      .limit(50)

    return NextResponse.json({ requests: results })
  } catch (error) {
    console.error('Requests GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description } = body

    if (!title || title.trim().length < 5) {
      return NextResponse.json({ error: 'Title must be at least 5 characters' }, { status: 400 })
    }

    const [req] = await db
      .insert(packRequests)
      .values({
        userId: session.userId,
        title: title.trim(),
        description: description?.trim() || null,
      })
      .returning()

    return NextResponse.json({ request: req }, { status: 201 })
  } catch (error) {
    console.error('Request create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
