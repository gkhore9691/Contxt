import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packs, users } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { packFormSchema } from '@/lib/pack/schema'
import { eq, and, or } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()

    const [pack] = await db
      .select({
        id: packs.id,
        userId: packs.userId,
        title: packs.title,
        description: packs.description,
        slug: packs.slug,
        isPublic: packs.isPublic,
        frameworkTag: packs.frameworkTag,
        languageTag: packs.languageTag,
        uiLib: packs.uiLib,
        db: packs.db,
        hosting: packs.hosting,
        architecture: packs.architecture,
        conventions: packs.conventions,
        aiRules: packs.aiRules,
        gotchas: packs.gotchas,
        upvoteCount: packs.upvoteCount,
        forkCount: packs.forkCount,
        copyCount: packs.copyCount,
        forkedFrom: packs.forkedFrom,
        createdAt: packs.createdAt,
        updatedAt: packs.updatedAt,
        authorUsername: users.username,
        authorAvatar: users.avatarUrl,
      })
      .from(packs)
      .innerJoin(users, eq(packs.userId, users.id))
      .where(
        and(
          eq(packs.id, id),
          or(
            eq(packs.isPublic, true),
            session ? eq(packs.userId, session.userId) : undefined
          )
        )
      )
      .limit(1)

    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 })
    }

    return NextResponse.json({ pack })
  } catch (error) {
    console.error('Get pack error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const parsed = packFormSchema.partial().safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const [existing] = await db
      .select({ userId: packs.userId })
      .from(packs)
      .where(eq(packs.id, id))
      .limit(1)

    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found or not authorized' }, { status: 404 })
    }

    const data = parsed.data

    const [updated] = await db
      .update(packs)
      .set({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
        ...(data.frameworkTag !== undefined && { frameworkTag: data.frameworkTag || null }),
        ...(data.languageTag !== undefined && { languageTag: data.languageTag || null }),
        ...(data.uiLib !== undefined && { uiLib: data.uiLib || null }),
        ...(data.db !== undefined && { db: data.db || null }),
        ...(data.hosting !== undefined && { hosting: data.hosting || null }),
        ...(data.architecture !== undefined && { architecture: data.architecture || null }),
        ...(data.conventions !== undefined && { conventions: data.conventions || null }),
        ...(data.aiRules !== undefined && { aiRules: data.aiRules || null }),
        ...(data.gotchas !== undefined && { gotchas: data.gotchas || null }),
        updatedAt: new Date(),
      })
      .where(eq(packs.id, id))
      .returning()

    return NextResponse.json({ pack: updated })
  } catch (error) {
    console.error('Update pack error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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
      .select({ userId: packs.userId })
      .from(packs)
      .where(eq(packs.id, id))
      .limit(1)

    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found or not authorized' }, { status: 404 })
    }

    await db.delete(packs).where(eq(packs.id, id))

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete pack error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
