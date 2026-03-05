import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packRequests } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { eq } from 'drizzle-orm'

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

    const [req] = await db
      .select({ claimedBy: packRequests.claimedBy })
      .from(packRequests)
      .where(eq(packRequests.id, id))
      .limit(1)

    if (!req) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (req.claimedBy) {
      return NextResponse.json({ error: 'Already claimed' }, { status: 409 })
    }

    const [updated] = await db
      .update(packRequests)
      .set({ claimedBy: session.userId })
      .where(eq(packRequests.id, id))
      .returning()

    return NextResponse.json({ request: updated })
  } catch (error) {
    console.error('Request claim error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
