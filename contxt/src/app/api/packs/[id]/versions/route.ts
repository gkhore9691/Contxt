import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packVersions, packs } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { eq, and, desc, sql } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const [pack] = await db
      .select({ userId: packs.userId })
      .from(packs)
      .where(eq(packs.id, id))
      .limit(1)

    if (!pack || pack.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const versions = await db
      .select()
      .from(packVersions)
      .where(eq(packVersions.packId, id))
      .orderBy(desc(packVersions.versionNumber))
      .limit(20)

    return NextResponse.json({ versions })
  } catch (error) {
    console.error('Versions GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [pack] = await db
      .select()
      .from(packs)
      .where(and(eq(packs.id, id), eq(packs.userId, session.userId)))
      .limit(1)

    if (!pack) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = await request.json()

    // Get next version number
    const [latest] = await db
      .select({ maxV: sql<number>`coalesce(max(${packVersions.versionNumber}), 0)` })
      .from(packVersions)
      .where(eq(packVersions.packId, id))

    const nextVersion = (latest?.maxV ?? 0) + 1

    const snapshot = {
      title: pack.title,
      description: pack.description,
      frameworkTag: pack.frameworkTag,
      languageTag: pack.languageTag,
      uiLib: pack.uiLib,
      db: pack.db,
      hosting: pack.hosting,
      architecture: pack.architecture,
      conventions: pack.conventions,
      aiRules: pack.aiRules,
      gotchas: pack.gotchas,
    }

    const [version] = await db
      .insert(packVersions)
      .values({
        packId: id,
        snapshot,
        versionNumber: nextVersion,
        changeNote: body.changeNote || null,
      })
      .returning()

    return NextResponse.json({ version }, { status: 201 })
  } catch (error) {
    console.error('Version create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
