import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packs, upvotes } from '@/lib/db/schema'
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

    // Check if already upvoted
    const [existing] = await db
      .select({ id: upvotes.id })
      .from(upvotes)
      .where(and(eq(upvotes.packId, id), eq(upvotes.userId, session.userId)))
      .limit(1)

    if (existing) {
      // Remove upvote
      await db.delete(upvotes).where(eq(upvotes.id, existing.id))
      await db
        .update(packs)
        .set({ upvoteCount: sql`${packs.upvoteCount} - 1` })
        .where(eq(packs.id, id))

      const [pack] = await db
        .select({ upvoteCount: packs.upvoteCount })
        .from(packs)
        .where(eq(packs.id, id))
        .limit(1)

      return NextResponse.json({ action: 'removed', count: pack?.upvoteCount ?? 0 })
    } else {
      // Add upvote
      await db.insert(upvotes).values({ packId: id, userId: session.userId })
      await db
        .update(packs)
        .set({ upvoteCount: sql`${packs.upvoteCount} + 1` })
        .where(eq(packs.id, id))

      const [pack] = await db
        .select({ upvoteCount: packs.upvoteCount })
        .from(packs)
        .where(eq(packs.id, id))
        .limit(1)

      return NextResponse.json({ action: 'added', count: pack?.upvoteCount ?? 0 })
    }
  } catch (error) {
    console.error('Upvote error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
