import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { collections, collectionItems, packs, users } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { eq, and, asc } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [col] = await db
      .select({
        id: collections.id,
        title: collections.title,
        description: collections.description,
        isPublic: collections.isPublic,
        followCount: collections.followCount,
        createdAt: collections.createdAt,
        userId: collections.userId,
        authorUsername: users.username,
      })
      .from(collections)
      .innerJoin(users, eq(collections.userId, users.id))
      .where(eq(collections.id, id))
      .limit(1)

    if (!col) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const items = await db
      .select({
        id: collectionItems.id,
        packId: collectionItems.packId,
        curatorNote: collectionItems.curatorNote,
        sortOrder: collectionItems.sortOrder,
        packTitle: packs.title,
        packDescription: packs.description,
        packFramework: packs.frameworkTag,
        packLanguage: packs.languageTag,
        packUpvotes: packs.upvoteCount,
        authorUsername: users.username,
      })
      .from(collectionItems)
      .innerJoin(packs, eq(collectionItems.packId, packs.id))
      .innerJoin(users, eq(packs.userId, users.id))
      .where(eq(collectionItems.collectionId, id))
      .orderBy(asc(collectionItems.sortOrder))

    return NextResponse.json({ collection: col, items })
  } catch (error) {
    console.error('Collection detail error:', error)
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

    const [col] = await db
      .select({ userId: collections.userId })
      .from(collections)
      .where(and(eq(collections.id, id), eq(collections.userId, session.userId)))
      .limit(1)

    if (!col) {
      return NextResponse.json({ error: 'Not found or not owner' }, { status: 404 })
    }

    const body = await request.json()
    const { packId, curatorNote } = body

    if (!packId) {
      return NextResponse.json({ error: 'packId required' }, { status: 400 })
    }

    const [item] = await db
      .insert(collectionItems)
      .values({
        collectionId: id,
        packId,
        curatorNote: curatorNote || null,
        sortOrder: 0,
      })
      .returning()

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('Add to collection error:', error)
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

    await db
      .delete(collections)
      .where(and(eq(collections.id, id), eq(collections.userId, session.userId)))

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Collection delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
