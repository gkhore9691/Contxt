import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packs, users } from '@/lib/db/schema'
import { eq, desc, ilike, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const framework = searchParams.get('framework')
    const sort = searchParams.get('sort') || 'upvotes'
    const q = searchParams.get('q')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const offset = parseInt(searchParams.get('offset') || '0')

    const conditions = [eq(packs.isPublic, true)]

    if (framework && framework !== 'All') {
      conditions.push(eq(packs.frameworkTag, framework))
    }

    if (q) {
      conditions.push(ilike(packs.title, `%${q}%`))
    }

    let orderBy
    switch (sort) {
      case 'forks':
        orderBy = desc(packs.forkCount)
        break
      case 'newest':
        orderBy = desc(packs.createdAt)
        break
      case 'upvotes':
      default:
        orderBy = desc(packs.upvoteCount)
        break
    }

    const results = await db
      .select({
        id: packs.id,
        title: packs.title,
        description: packs.description,
        slug: packs.slug,
        frameworkTag: packs.frameworkTag,
        languageTag: packs.languageTag,
        uiLib: packs.uiLib,
        db: packs.db,
        hosting: packs.hosting,
        upvoteCount: packs.upvoteCount,
        forkCount: packs.forkCount,
        createdAt: packs.createdAt,
        authorUsername: users.username,
        authorAvatar: users.avatarUrl,
      })
      .from(packs)
      .innerJoin(users, eq(packs.userId, users.id))
      .where(and(...conditions))
      .orderBy(orderBy, desc(packs.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({ packs: results })
  } catch (error) {
    console.error('Community error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
