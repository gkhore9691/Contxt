import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packs } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db
      .update(packs)
      .set({ copyCount: sql`${packs.copyCount} + 1` })
      .where(eq(packs.id, id))

    const [pack] = await db
      .select({ copyCount: packs.copyCount })
      .from(packs)
      .where(eq(packs.id, id))
      .limit(1)

    return NextResponse.json({ count: pack?.copyCount ?? 0 })
  } catch (error) {
    console.error('Copy count error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
