import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  uniqueIndex,
  jsonb,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  plan: text('plan').notNull().default('free'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const packs = pgTable('packs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  isPublic: boolean('is_public').default(false).notNull(),
  frameworkTag: text('framework_tag'),
  languageTag: text('language_tag'),
  uiLib: text('ui_lib'),
  db: text('db'),
  hosting: text('hosting'),
  architecture: text('architecture'),
  conventions: text('conventions'),
  aiRules: text('ai_rules'),
  gotchas: text('gotchas'),
  upvoteCount: integer('upvote_count').default(0).notNull(),
  forkCount: integer('fork_count').default(0).notNull(),
  copyCount: integer('copy_count').default(0).notNull(),
  forkedFrom: uuid('forked_from'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const upvotes = pgTable(
  'upvotes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    packId: uuid('pack_id')
      .references(() => packs.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('upvotes_user_pack_idx').on(table.userId, table.packId)]
)

export const forks = pgTable('forks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  sourcePackId: uuid('source_pack_id').references(() => packs.id, {
    onDelete: 'set null',
  }),
  forkedPackId: uuid('forked_pack_id')
    .references(() => packs.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const packVersions = pgTable('pack_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  packId: uuid('pack_id')
    .references(() => packs.id, { onDelete: 'cascade' })
    .notNull(),
  snapshot: jsonb('snapshot').notNull(),
  versionNumber: integer('version_number').notNull(),
  changeNote: text('change_note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const collections = pgTable('collections', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').default(true).notNull(),
  followCount: integer('follow_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const collectionItems = pgTable(
  'collection_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    collectionId: uuid('collection_id')
      .references(() => collections.id, { onDelete: 'cascade' })
      .notNull(),
    packId: uuid('pack_id')
      .references(() => packs.id, { onDelete: 'cascade' })
      .notNull(),
    curatorNote: text('curator_note'),
    sortOrder: integer('sort_order').default(0).notNull(),
    addedAt: timestamp('added_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('collection_pack_idx').on(table.collectionId, table.packId)]
)

export const packRequests = pgTable('pack_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  upvoteCount: integer('upvote_count').default(0).notNull(),
  claimedBy: uuid('claimed_by').references(() => users.id),
  fulfilledPackId: uuid('fulfilled_pack_id').references(() => packs.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const requestUpvotes = pgTable(
  'request_upvotes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    requestId: uuid('request_id')
      .references(() => packRequests.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('request_upvotes_user_req_idx').on(table.userId, table.requestId)]
)
