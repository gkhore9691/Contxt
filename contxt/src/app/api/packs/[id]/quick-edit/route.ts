import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packs } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { eq, and } from 'drizzle-orm'

const EDITABLE_FIELDS = [
  'title', 'description', 'frameworkTag', 'languageTag', 'uiLib',
  'db', 'hosting', 'architecture', 'conventions', 'aiRules', 'gotchas',
] as const

type EditableField = typeof EDITABLE_FIELDS[number]

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { field, value } = body as { field: string; value: string }

    if (!EDITABLE_FIELDS.includes(field as EditableField)) {
      return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
    }

    const [pack] = await db
      .select({ userId: packs.userId })
      .from(packs)
      .where(and(eq(packs.id, id), eq(packs.userId, session.userId)))
      .limit(1)

    if (!pack) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const [updated] = await db
      .update(packs)
      .set({ [field]: value || null, updatedAt: new Date() })
      .where(eq(packs.id, id))
      .returning()

    return NextResponse.json({ pack: updated })
  } catch (error) {
    console.error('Quick edit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
