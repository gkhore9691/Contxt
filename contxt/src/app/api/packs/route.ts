import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packs, users } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/jwt'
import { packFormSchema } from '@/lib/pack/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function GET() {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userPacks = await db
      .select()
      .from(packs)
      .where(eq(packs.userId, session.userId))
      .orderBy(desc(packs.updatedAt))

    return NextResponse.json({ packs: userPacks })
  } catch (error) {
    console.error('Get packs error:', error)
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
    const parsed = packFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    // Check plan limits
    const [user] = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (user?.plan === 'free') {
      const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(packs)
        .where(eq(packs.userId, session.userId))

      if ((countResult[0]?.count ?? 0) >= 3) {
        return NextResponse.json(
          { error: 'Free plan limited to 3 packs. Upgrade to Pro for unlimited.' },
          { status: 403 }
        )
      }
    }

    const data = parsed.data
    const slug = `${slugify(data.title)}-${nanoid(6)}`

    const [pack] = await db
      .insert(packs)
      .values({
        userId: session.userId,
        title: data.title,
        description: data.description || null,
        slug,
        isPublic: data.isPublic,
        frameworkTag: data.frameworkTag || null,
        languageTag: data.languageTag || null,
        uiLib: data.uiLib || null,
        db: data.db || null,
        hosting: data.hosting || null,
        architecture: data.architecture || null,
        conventions: data.conventions || null,
        aiRules: data.aiRules || null,
        gotchas: data.gotchas || null,
      })
      .returning()

    return NextResponse.json({ pack }, { status: 201 })
  } catch (error) {
    console.error('Create pack error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
