import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packs, forks, users } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { eq, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'

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

    // Check plan — free users can't fork
    const [user] = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (user?.plan === 'free') {
      return NextResponse.json(
        { error: 'Upgrade to Pro to fork packs' },
        { status: 403 }
      )
    }

    // Get source pack
    const [source] = await db
      .select()
      .from(packs)
      .where(eq(packs.id, id))
      .limit(1)

    if (!source || !source.isPublic) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 })
    }

    const slug = `fork-${source.slug}-${nanoid(6)}`

    // Create forked pack
    const [forkedPack] = await db
      .insert(packs)
      .values({
        userId: session.userId,
        title: `Fork of ${source.title}`,
        description: source.description,
        slug,
        isPublic: false,
        frameworkTag: source.frameworkTag,
        languageTag: source.languageTag,
        uiLib: source.uiLib,
        db: source.db,
        hosting: source.hosting,
        architecture: source.architecture,
        conventions: source.conventions,
        aiRules: source.aiRules,
        gotchas: source.gotchas,
        forkedFrom: source.id,
      })
      .returning()

    // Record fork
    await db.insert(forks).values({
      userId: session.userId,
      sourcePackId: source.id,
      forkedPackId: forkedPack.id,
    })

    // Increment fork count
    await db
      .update(packs)
      .set({ forkCount: sql`${packs.forkCount} + 1` })
      .where(eq(packs.id, id))

    return NextResponse.json({ pack: forkedPack }, { status: 201 })
  } catch (error) {
    console.error('Fork error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
