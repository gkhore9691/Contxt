import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { collections, collectionItems, packs, users } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { eq, desc, and, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mine = searchParams.get('mine') === 'true'
    const session = await getCurrentUser()

    let conditions
    if (mine && session) {
      conditions = eq(collections.userId, session.userId)
    } else {
      conditions = eq(collections.isPublic, true)
    }

    const results = await db
      .select({
        id: collections.id,
        title: collections.title,
        description: collections.description,
        isPublic: collections.isPublic,
        followCount: collections.followCount,
        createdAt: collections.createdAt,
        authorUsername: users.username,
        itemCount: sql<number>`(select count(*) from collection_items where collection_id = ${collections.id})::int`,
      })
      .from(collections)
      .innerJoin(users, eq(collections.userId, users.id))
      .where(conditions)
      .orderBy(desc(collections.followCount))
      .limit(50)

    return NextResponse.json({ collections: results })
  } catch (error) {
    console.error('Collections GET error:', error)
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
    const { title, description, isPublic = true } = body

    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 })
    }

    const [col] = await db
      .insert(collections)
      .values({
        userId: session.userId,
        title: title.trim(),
        description: description?.trim() || null,
        isPublic,
      })
      .returning()

    return NextResponse.json({ collection: col }, { status: 201 })
  } catch (error) {
    console.error('Collection create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
