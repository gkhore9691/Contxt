import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packRequests, requestUpvotes } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { eq, and, sql } from 'drizzle-orm'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [existing] = await db
      .select({ id: requestUpvotes.id })
      .from(requestUpvotes)
      .where(and(eq(requestUpvotes.requestId, id), eq(requestUpvotes.userId, session.userId)))
      .limit(1)

    if (existing) {
      await db.delete(requestUpvotes).where(eq(requestUpvotes.id, existing.id))
      await db.update(packRequests).set({ upvoteCount: sql`${packRequests.upvoteCount} - 1` }).where(eq(packRequests.id, id))
      const [r] = await db.select({ upvoteCount: packRequests.upvoteCount }).from(packRequests).where(eq(packRequests.id, id)).limit(1)
      return NextResponse.json({ action: 'removed', count: r?.upvoteCount ?? 0 })
    } else {
      await db.insert(requestUpvotes).values({ requestId: id, userId: session.userId })
      await db.update(packRequests).set({ upvoteCount: sql`${packRequests.upvoteCount} + 1` }).where(eq(packRequests.id, id))
      const [r] = await db.select({ upvoteCount: packRequests.upvoteCount }).from(packRequests).where(eq(packRequests.id, id)).limit(1)
      return NextResponse.json({ action: 'added', count: r?.upvoteCount ?? 0 })
    }
  } catch (error) {
    console.error('Request upvote error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
