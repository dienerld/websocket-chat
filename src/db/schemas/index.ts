import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const friend = pgTable('friends', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  friendId: text('friend_id')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// // Relacionamento de amigos
// export const userRelations = relations(user, ({ many }) => ({
//   friends: many(friend, {
//     relationName: 'user_friends',
//   }),
//   roomMembers: many(roomMembers),
// }))

export const rooms = pgTable('rooms', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const roomMembers = pgTable('room_members', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  roomId: text('room_id')
    .notNull()
    .references(() => rooms.id),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// // Relacionamento de membros da sala
// export const roomRelations = relations(rooms, ({ many }) => ({
//   members: many(roomMembers),
// }))

// // Relacionamento de membros em relação ao usuário e à sala
// export const roomMembersRelations = relations(roomMembers, ({ one }) => ({
//   user: one(user, {
//     fields: [roomMembers.userId],
//     references: [user.id],
//   }),
//   room: one(rooms, {
//     fields: [roomMembers.roomId],
//     references: [rooms.id],
//   }),
// }))
