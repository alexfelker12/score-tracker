import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','createdAt','updatedAt','username','displayUsername']);

export const SessionScalarFieldEnumSchema = z.enum(['id','expiresAt','token','createdAt','updatedAt','ipAddress','userAgent','userId']);

export const AccountScalarFieldEnumSchema = z.enum(['id','accountId','providerId','userId','accessToken','refreshToken','idToken','accessTokenExpiresAt','refreshTokenExpiresAt','scope','password','createdAt','updatedAt']);

export const VerificationScalarFieldEnumSchema = z.enum(['id','identifier','value','expiresAt','createdAt','updatedAt']);

export const TrackerScalarFieldEnumSchema = z.enum(['id','creatorId','name','displayName','archived','createdAt']);

export const TrackerPlayerScalarFieldEnumSchema = z.enum(['id','trackerId','playerId','name']);

export const GameScalarFieldEnumSchema = z.enum(['id','trackerId','completedAt','winnerId','firstAtZero','lastTwo','createdAt']);

export const RoundScalarFieldEnumSchema = z.enum(['id','gameId','roundNumber','createdAt']);

export const RoundPlayerStateScalarFieldEnumSchema = z.enum(['id','roundId','playerId','lifes']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const TrackerNameSchema = z.enum(['SCHWIMMEN']);

export type TrackerNameType = `${z.infer<typeof TrackerNameSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().nullable(),
  displayUsername: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.string(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  idToken: z.string().nullable(),
  accessTokenExpiresAt: z.coerce.date().nullable(),
  refreshTokenExpiresAt: z.coerce.date().nullable(),
  scope: z.string().nullable(),
  password: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// VERIFICATION SCHEMA
/////////////////////////////////////////

export const VerificationSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable(),
})

export type Verification = z.infer<typeof VerificationSchema>

/////////////////////////////////////////
// TRACKER SCHEMA
/////////////////////////////////////////

export const TrackerSchema = z.object({
  name: TrackerNameSchema,
  id: z.string().cuid(),
  creatorId: z.string(),
  displayName: z.string(),
  archived: z.boolean(),
  createdAt: z.coerce.date(),
})

export type Tracker = z.infer<typeof TrackerSchema>

/////////////////////////////////////////
// TRACKER PLAYER SCHEMA
/////////////////////////////////////////

export const TrackerPlayerSchema = z.object({
  id: z.string().cuid(),
  trackerId: z.string(),
  playerId: z.string().nullable(),
  name: z.string().nullable(),
})

export type TrackerPlayer = z.infer<typeof TrackerPlayerSchema>

/////////////////////////////////////////
// GAME SCHEMA
/////////////////////////////////////////

export const GameSchema = z.object({
  id: z.string().cuid(),
  trackerId: z.string(),
  completedAt: z.coerce.date().nullable(),
  winnerId: z.string().nullable(),
  firstAtZero: z.string().nullable(),
  lastTwo: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
})

export type Game = z.infer<typeof GameSchema>

/////////////////////////////////////////
// ROUND SCHEMA
/////////////////////////////////////////

export const RoundSchema = z.object({
  id: z.string().cuid(),
  gameId: z.string(),
  roundNumber: z.number().int(),
  createdAt: z.coerce.date(),
})

export type Round = z.infer<typeof RoundSchema>

/////////////////////////////////////////
// ROUND PLAYER STATE SCHEMA
/////////////////////////////////////////

export const RoundPlayerStateSchema = z.object({
  id: z.string().cuid(),
  roundId: z.string(),
  playerId: z.string(),
  lifes: z.number().int(),
})

export type RoundPlayerState = z.infer<typeof RoundPlayerStateSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  creator: z.union([z.boolean(),z.lazy(() => TrackerFindManyArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => TrackerPlayerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  sessions: z.boolean().optional(),
  accounts: z.boolean().optional(),
  creator: z.boolean().optional(),
  player: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  username: z.boolean().optional(),
  displayUsername: z.boolean().optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  creator: z.union([z.boolean(),z.lazy(() => TrackerFindManyArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => TrackerPlayerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  token: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  ipAddress: z.boolean().optional(),
  userAgent: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  accountId: z.boolean().optional(),
  providerId: z.boolean().optional(),
  userId: z.boolean().optional(),
  accessToken: z.boolean().optional(),
  refreshToken: z.boolean().optional(),
  idToken: z.boolean().optional(),
  accessTokenExpiresAt: z.boolean().optional(),
  refreshTokenExpiresAt: z.boolean().optional(),
  scope: z.boolean().optional(),
  password: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// VERIFICATION
//------------------------------------------------------

export const VerificationSelectSchema: z.ZodType<Prisma.VerificationSelect> = z.object({
  id: z.boolean().optional(),
  identifier: z.boolean().optional(),
  value: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// TRACKER
//------------------------------------------------------

export const TrackerIncludeSchema: z.ZodType<Prisma.TrackerInclude> = z.object({
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  players: z.union([z.boolean(),z.lazy(() => TrackerPlayerFindManyArgsSchema)]).optional(),
  games: z.union([z.boolean(),z.lazy(() => GameFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TrackerCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TrackerArgsSchema: z.ZodType<Prisma.TrackerDefaultArgs> = z.object({
  select: z.lazy(() => TrackerSelectSchema).optional(),
  include: z.lazy(() => TrackerIncludeSchema).optional(),
}).strict();

export const TrackerCountOutputTypeArgsSchema: z.ZodType<Prisma.TrackerCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TrackerCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TrackerCountOutputTypeSelectSchema: z.ZodType<Prisma.TrackerCountOutputTypeSelect> = z.object({
  players: z.boolean().optional(),
  games: z.boolean().optional(),
}).strict();

export const TrackerSelectSchema: z.ZodType<Prisma.TrackerSelect> = z.object({
  id: z.boolean().optional(),
  creatorId: z.boolean().optional(),
  name: z.boolean().optional(),
  displayName: z.boolean().optional(),
  archived: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  players: z.union([z.boolean(),z.lazy(() => TrackerPlayerFindManyArgsSchema)]).optional(),
  games: z.union([z.boolean(),z.lazy(() => GameFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TrackerCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TRACKER PLAYER
//------------------------------------------------------

export const TrackerPlayerIncludeSchema: z.ZodType<Prisma.TrackerPlayerInclude> = z.object({
  tracker: z.union([z.boolean(),z.lazy(() => TrackerArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  RoundPlayerState: z.union([z.boolean(),z.lazy(() => RoundPlayerStateFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TrackerPlayerCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TrackerPlayerArgsSchema: z.ZodType<Prisma.TrackerPlayerDefaultArgs> = z.object({
  select: z.lazy(() => TrackerPlayerSelectSchema).optional(),
  include: z.lazy(() => TrackerPlayerIncludeSchema).optional(),
}).strict();

export const TrackerPlayerCountOutputTypeArgsSchema: z.ZodType<Prisma.TrackerPlayerCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TrackerPlayerCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TrackerPlayerCountOutputTypeSelectSchema: z.ZodType<Prisma.TrackerPlayerCountOutputTypeSelect> = z.object({
  RoundPlayerState: z.boolean().optional(),
}).strict();

export const TrackerPlayerSelectSchema: z.ZodType<Prisma.TrackerPlayerSelect> = z.object({
  id: z.boolean().optional(),
  trackerId: z.boolean().optional(),
  playerId: z.boolean().optional(),
  name: z.boolean().optional(),
  tracker: z.union([z.boolean(),z.lazy(() => TrackerArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  RoundPlayerState: z.union([z.boolean(),z.lazy(() => RoundPlayerStateFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TrackerPlayerCountOutputTypeArgsSchema)]).optional(),
}).strict()

// GAME
//------------------------------------------------------

export const GameIncludeSchema: z.ZodType<Prisma.GameInclude> = z.object({
  tracker: z.union([z.boolean(),z.lazy(() => TrackerArgsSchema)]).optional(),
  rounds: z.union([z.boolean(),z.lazy(() => RoundFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => GameCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const GameArgsSchema: z.ZodType<Prisma.GameDefaultArgs> = z.object({
  select: z.lazy(() => GameSelectSchema).optional(),
  include: z.lazy(() => GameIncludeSchema).optional(),
}).strict();

export const GameCountOutputTypeArgsSchema: z.ZodType<Prisma.GameCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => GameCountOutputTypeSelectSchema).nullish(),
}).strict();

export const GameCountOutputTypeSelectSchema: z.ZodType<Prisma.GameCountOutputTypeSelect> = z.object({
  rounds: z.boolean().optional(),
}).strict();

export const GameSelectSchema: z.ZodType<Prisma.GameSelect> = z.object({
  id: z.boolean().optional(),
  trackerId: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  winnerId: z.boolean().optional(),
  firstAtZero: z.boolean().optional(),
  lastTwo: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  tracker: z.union([z.boolean(),z.lazy(() => TrackerArgsSchema)]).optional(),
  rounds: z.union([z.boolean(),z.lazy(() => RoundFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => GameCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ROUND
//------------------------------------------------------

export const RoundIncludeSchema: z.ZodType<Prisma.RoundInclude> = z.object({
  game: z.union([z.boolean(),z.lazy(() => GameArgsSchema)]).optional(),
  states: z.union([z.boolean(),z.lazy(() => RoundPlayerStateFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoundCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const RoundArgsSchema: z.ZodType<Prisma.RoundDefaultArgs> = z.object({
  select: z.lazy(() => RoundSelectSchema).optional(),
  include: z.lazy(() => RoundIncludeSchema).optional(),
}).strict();

export const RoundCountOutputTypeArgsSchema: z.ZodType<Prisma.RoundCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RoundCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RoundCountOutputTypeSelectSchema: z.ZodType<Prisma.RoundCountOutputTypeSelect> = z.object({
  states: z.boolean().optional(),
}).strict();

export const RoundSelectSchema: z.ZodType<Prisma.RoundSelect> = z.object({
  id: z.boolean().optional(),
  gameId: z.boolean().optional(),
  roundNumber: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  game: z.union([z.boolean(),z.lazy(() => GameArgsSchema)]).optional(),
  states: z.union([z.boolean(),z.lazy(() => RoundPlayerStateFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoundCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ROUND PLAYER STATE
//------------------------------------------------------

export const RoundPlayerStateIncludeSchema: z.ZodType<Prisma.RoundPlayerStateInclude> = z.object({
  round: z.union([z.boolean(),z.lazy(() => RoundArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => TrackerPlayerArgsSchema)]).optional(),
}).strict()

export const RoundPlayerStateArgsSchema: z.ZodType<Prisma.RoundPlayerStateDefaultArgs> = z.object({
  select: z.lazy(() => RoundPlayerStateSelectSchema).optional(),
  include: z.lazy(() => RoundPlayerStateIncludeSchema).optional(),
}).strict();

export const RoundPlayerStateSelectSchema: z.ZodType<Prisma.RoundPlayerStateSelect> = z.object({
  id: z.boolean().optional(),
  roundId: z.boolean().optional(),
  playerId: z.boolean().optional(),
  lifes: z.boolean().optional(),
  round: z.union([z.boolean(),z.lazy(() => RoundArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => TrackerPlayerArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  username: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  displayUsername: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  creator: z.lazy(() => TrackerListRelationFilterSchema).optional(),
  player: z.lazy(() => TrackerPlayerListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  displayUsername: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  creator: z.lazy(() => TrackerOrderByRelationAggregateInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email: z.string(),
    username: z.string()
  }),
  z.object({
    id: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.string(),
    username: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email: z.string(),
    username: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
  z.object({
    username: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  displayUsername: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  creator: z.lazy(() => TrackerListRelationFilterSchema).optional(),
  player: z.lazy(() => TrackerPlayerListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  displayUsername: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  username: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  displayUsername: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    token: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    token: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  token: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  idToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accessTokenExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  accountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  idToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accessTokenExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationWhereInputSchema: z.ZodType<Prisma.VerificationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationWhereInputSchema),z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationWhereInputSchema),z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const VerificationOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
}).strict();

export const VerificationWhereUniqueInputSchema: z.ZodType<Prisma.VerificationWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => VerificationWhereInputSchema),z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationWhereInputSchema),z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict());

export const VerificationOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => VerificationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationMinOrderByAggregateInputSchema).optional()
}).strict();

export const VerificationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const TrackerWhereInputSchema: z.ZodType<Prisma.TrackerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TrackerWhereInputSchema),z.lazy(() => TrackerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackerWhereInputSchema),z.lazy(() => TrackerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => EnumTrackerNameFilterSchema),z.lazy(() => TrackerNameSchema) ]).optional(),
  displayName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  archived: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  players: z.lazy(() => TrackerPlayerListRelationFilterSchema).optional(),
  games: z.lazy(() => GameListRelationFilterSchema).optional()
}).strict();

export const TrackerOrderByWithRelationInputSchema: z.ZodType<Prisma.TrackerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  archived: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  players: z.lazy(() => TrackerPlayerOrderByRelationAggregateInputSchema).optional(),
  games: z.lazy(() => GameOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TrackerWhereUniqueInputSchema: z.ZodType<Prisma.TrackerWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TrackerWhereInputSchema),z.lazy(() => TrackerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackerWhereInputSchema),z.lazy(() => TrackerWhereInputSchema).array() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => EnumTrackerNameFilterSchema),z.lazy(() => TrackerNameSchema) ]).optional(),
  displayName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  archived: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  players: z.lazy(() => TrackerPlayerListRelationFilterSchema).optional(),
  games: z.lazy(() => GameListRelationFilterSchema).optional()
}).strict());

export const TrackerOrderByWithAggregationInputSchema: z.ZodType<Prisma.TrackerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  archived: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TrackerCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TrackerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TrackerMinOrderByAggregateInputSchema).optional()
}).strict();

export const TrackerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TrackerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TrackerScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackerScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => EnumTrackerNameWithAggregatesFilterSchema),z.lazy(() => TrackerNameSchema) ]).optional(),
  displayName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  archived: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TrackerPlayerWhereInputSchema: z.ZodType<Prisma.TrackerPlayerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TrackerPlayerWhereInputSchema),z.lazy(() => TrackerPlayerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackerPlayerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackerPlayerWhereInputSchema),z.lazy(() => TrackerPlayerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  trackerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tracker: z.union([ z.lazy(() => TrackerScalarRelationFilterSchema),z.lazy(() => TrackerWhereInputSchema) ]).optional(),
  player: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateListRelationFilterSchema).optional()
}).strict();

export const TrackerPlayerOrderByWithRelationInputSchema: z.ZodType<Prisma.TrackerPlayerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tracker: z.lazy(() => TrackerOrderByWithRelationInputSchema).optional(),
  player: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TrackerPlayerWhereUniqueInputSchema: z.ZodType<Prisma.TrackerPlayerWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TrackerPlayerWhereInputSchema),z.lazy(() => TrackerPlayerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackerPlayerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackerPlayerWhereInputSchema),z.lazy(() => TrackerPlayerWhereInputSchema).array() ]).optional(),
  trackerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tracker: z.union([ z.lazy(() => TrackerScalarRelationFilterSchema),z.lazy(() => TrackerWhereInputSchema) ]).optional(),
  player: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateListRelationFilterSchema).optional()
}).strict());

export const TrackerPlayerOrderByWithAggregationInputSchema: z.ZodType<Prisma.TrackerPlayerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => TrackerPlayerCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TrackerPlayerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TrackerPlayerMinOrderByAggregateInputSchema).optional()
}).strict();

export const TrackerPlayerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TrackerPlayerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TrackerPlayerScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackerPlayerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackerPlayerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackerPlayerScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackerPlayerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  trackerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const GameWhereInputSchema: z.ZodType<Prisma.GameWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GameWhereInputSchema),z.lazy(() => GameWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameWhereInputSchema),z.lazy(() => GameWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  trackerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  winnerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  firstAtZero: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastTwo: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tracker: z.union([ z.lazy(() => TrackerScalarRelationFilterSchema),z.lazy(() => TrackerWhereInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundListRelationFilterSchema).optional()
}).strict();

export const GameOrderByWithRelationInputSchema: z.ZodType<Prisma.GameOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  winnerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  firstAtZero: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastTwo: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  tracker: z.lazy(() => TrackerOrderByWithRelationInputSchema).optional(),
  rounds: z.lazy(() => RoundOrderByRelationAggregateInputSchema).optional()
}).strict();

export const GameWhereUniqueInputSchema: z.ZodType<Prisma.GameWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => GameWhereInputSchema),z.lazy(() => GameWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameWhereInputSchema),z.lazy(() => GameWhereInputSchema).array() ]).optional(),
  trackerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  winnerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  firstAtZero: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastTwo: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tracker: z.union([ z.lazy(() => TrackerScalarRelationFilterSchema),z.lazy(() => TrackerWhereInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundListRelationFilterSchema).optional()
}).strict());

export const GameOrderByWithAggregationInputSchema: z.ZodType<Prisma.GameOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  winnerId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  firstAtZero: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastTwo: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => GameCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => GameMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => GameMinOrderByAggregateInputSchema).optional()
}).strict();

export const GameScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.GameScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => GameScalarWhereWithAggregatesInputSchema),z.lazy(() => GameScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameScalarWhereWithAggregatesInputSchema),z.lazy(() => GameScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  trackerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  winnerId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  firstAtZero: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastTwo: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RoundWhereInputSchema: z.ZodType<Prisma.RoundWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoundWhereInputSchema),z.lazy(() => RoundWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundWhereInputSchema),z.lazy(() => RoundWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gameId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roundNumber: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  game: z.union([ z.lazy(() => GameScalarRelationFilterSchema),z.lazy(() => GameWhereInputSchema) ]).optional(),
  states: z.lazy(() => RoundPlayerStateListRelationFilterSchema).optional()
}).strict();

export const RoundOrderByWithRelationInputSchema: z.ZodType<Prisma.RoundOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameId: z.lazy(() => SortOrderSchema).optional(),
  roundNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  game: z.lazy(() => GameOrderByWithRelationInputSchema).optional(),
  states: z.lazy(() => RoundPlayerStateOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RoundWhereUniqueInputSchema: z.ZodType<Prisma.RoundWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    gameId_roundNumber: z.lazy(() => RoundGameIdRoundNumberCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    gameId_roundNumber: z.lazy(() => RoundGameIdRoundNumberCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  gameId_roundNumber: z.lazy(() => RoundGameIdRoundNumberCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => RoundWhereInputSchema),z.lazy(() => RoundWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundWhereInputSchema),z.lazy(() => RoundWhereInputSchema).array() ]).optional(),
  gameId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roundNumber: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  game: z.union([ z.lazy(() => GameScalarRelationFilterSchema),z.lazy(() => GameWhereInputSchema) ]).optional(),
  states: z.lazy(() => RoundPlayerStateListRelationFilterSchema).optional()
}).strict());

export const RoundOrderByWithAggregationInputSchema: z.ZodType<Prisma.RoundOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameId: z.lazy(() => SortOrderSchema).optional(),
  roundNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RoundCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RoundAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RoundMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RoundMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RoundSumOrderByAggregateInputSchema).optional()
}).strict();

export const RoundScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RoundScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RoundScalarWhereWithAggregatesInputSchema),z.lazy(() => RoundScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundScalarWhereWithAggregatesInputSchema),z.lazy(() => RoundScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  gameId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  roundNumber: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RoundPlayerStateWhereInputSchema: z.ZodType<Prisma.RoundPlayerStateWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoundPlayerStateWhereInputSchema),z.lazy(() => RoundPlayerStateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundPlayerStateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundPlayerStateWhereInputSchema),z.lazy(() => RoundPlayerStateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roundId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lifes: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  round: z.union([ z.lazy(() => RoundScalarRelationFilterSchema),z.lazy(() => RoundWhereInputSchema) ]).optional(),
  player: z.union([ z.lazy(() => TrackerPlayerScalarRelationFilterSchema),z.lazy(() => TrackerPlayerWhereInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateOrderByWithRelationInputSchema: z.ZodType<Prisma.RoundPlayerStateOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  lifes: z.lazy(() => SortOrderSchema).optional(),
  round: z.lazy(() => RoundOrderByWithRelationInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerOrderByWithRelationInputSchema).optional()
}).strict();

export const RoundPlayerStateWhereUniqueInputSchema: z.ZodType<Prisma.RoundPlayerStateWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => RoundPlayerStateWhereInputSchema),z.lazy(() => RoundPlayerStateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundPlayerStateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundPlayerStateWhereInputSchema),z.lazy(() => RoundPlayerStateWhereInputSchema).array() ]).optional(),
  roundId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lifes: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  round: z.union([ z.lazy(() => RoundScalarRelationFilterSchema),z.lazy(() => RoundWhereInputSchema) ]).optional(),
  player: z.union([ z.lazy(() => TrackerPlayerScalarRelationFilterSchema),z.lazy(() => TrackerPlayerWhereInputSchema) ]).optional(),
}).strict());

export const RoundPlayerStateOrderByWithAggregationInputSchema: z.ZodType<Prisma.RoundPlayerStateOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  lifes: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RoundPlayerStateCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RoundPlayerStateAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RoundPlayerStateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RoundPlayerStateMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RoundPlayerStateSumOrderByAggregateInputSchema).optional()
}).strict();

export const RoundPlayerStateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RoundPlayerStateScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RoundPlayerStateScalarWhereWithAggregatesInputSchema),z.lazy(() => RoundPlayerStateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundPlayerStateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundPlayerStateScalarWhereWithAggregatesInputSchema),z.lazy(() => RoundPlayerStateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  roundId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lifes: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  creator: z.lazy(() => TrackerCreateNestedManyWithoutCreatorInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  creator: z.lazy(() => TrackerUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  creator: z.lazy(() => TrackerUpdateManyWithoutCreatorNestedInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  creator: z.lazy(() => TrackerUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  userId: z.string()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  userId: z.string()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationCreateInputSchema: z.ZodType<Prisma.VerificationCreateInput> = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable()
}).strict();

export const VerificationUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationUncheckedCreateInput> = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable()
}).strict();

export const VerificationUpdateInputSchema: z.ZodType<Prisma.VerificationUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VerificationUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VerificationCreateManyInputSchema: z.ZodType<Prisma.VerificationCreateManyInput> = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable()
}).strict();

export const VerificationUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VerificationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TrackerCreateInputSchema: z.ZodType<Prisma.TrackerCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatorInputSchema),
  players: z.lazy(() => TrackerPlayerCreateNestedManyWithoutTrackerInputSchema).optional(),
  games: z.lazy(() => GameCreateNestedManyWithoutTrackerInputSchema).optional()
}).strict();

export const TrackerUncheckedCreateInputSchema: z.ZodType<Prisma.TrackerUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  creatorId: z.string(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  players: z.lazy(() => TrackerPlayerUncheckedCreateNestedManyWithoutTrackerInputSchema).optional(),
  games: z.lazy(() => GameUncheckedCreateNestedManyWithoutTrackerInputSchema).optional()
}).strict();

export const TrackerUpdateInputSchema: z.ZodType<Prisma.TrackerUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatorNestedInputSchema).optional(),
  players: z.lazy(() => TrackerPlayerUpdateManyWithoutTrackerNestedInputSchema).optional(),
  games: z.lazy(() => GameUpdateManyWithoutTrackerNestedInputSchema).optional()
}).strict();

export const TrackerUncheckedUpdateInputSchema: z.ZodType<Prisma.TrackerUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  players: z.lazy(() => TrackerPlayerUncheckedUpdateManyWithoutTrackerNestedInputSchema).optional(),
  games: z.lazy(() => GameUncheckedUpdateManyWithoutTrackerNestedInputSchema).optional()
}).strict();

export const TrackerCreateManyInputSchema: z.ZodType<Prisma.TrackerCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  creatorId: z.string(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const TrackerUpdateManyMutationInputSchema: z.ZodType<Prisma.TrackerUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TrackerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackerPlayerCreateInputSchema: z.ZodType<Prisma.TrackerPlayerCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  tracker: z.lazy(() => TrackerCreateNestedOneWithoutPlayersInputSchema),
  player: z.lazy(() => UserCreateNestedOneWithoutPlayerInputSchema).optional(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedCreateInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  trackerId: z.string(),
  playerId: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const TrackerPlayerUpdateInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tracker: z.lazy(() => TrackerUpdateOneRequiredWithoutPlayersNestedInputSchema).optional(),
  player: z.lazy(() => UserUpdateOneWithoutPlayerNestedInputSchema).optional(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedUpdateInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const TrackerPlayerCreateManyInputSchema: z.ZodType<Prisma.TrackerPlayerCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  trackerId: z.string(),
  playerId: z.string().optional().nullable(),
  name: z.string().optional().nullable()
}).strict();

export const TrackerPlayerUpdateManyMutationInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TrackerPlayerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GameCreateInputSchema: z.ZodType<Prisma.GameCreateInput> = z.object({
  id: z.string().cuid().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  winnerId: z.string().optional().nullable(),
  firstAtZero: z.string().optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  tracker: z.lazy(() => TrackerCreateNestedOneWithoutGamesInputSchema),
  rounds: z.lazy(() => RoundCreateNestedManyWithoutGameInputSchema).optional()
}).strict();

export const GameUncheckedCreateInputSchema: z.ZodType<Prisma.GameUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  trackerId: z.string(),
  completedAt: z.coerce.date().optional().nullable(),
  winnerId: z.string().optional().nullable(),
  firstAtZero: z.string().optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundUncheckedCreateNestedManyWithoutGameInputSchema).optional()
}).strict();

export const GameUpdateInputSchema: z.ZodType<Prisma.GameUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  winnerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstAtZero: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracker: z.lazy(() => TrackerUpdateOneRequiredWithoutGamesNestedInputSchema).optional(),
  rounds: z.lazy(() => RoundUpdateManyWithoutGameNestedInputSchema).optional()
}).strict();

export const GameUncheckedUpdateInputSchema: z.ZodType<Prisma.GameUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  winnerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstAtZero: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUncheckedUpdateManyWithoutGameNestedInputSchema).optional()
}).strict();

export const GameCreateManyInputSchema: z.ZodType<Prisma.GameCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  trackerId: z.string(),
  completedAt: z.coerce.date().optional().nullable(),
  winnerId: z.string().optional().nullable(),
  firstAtZero: z.string().optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const GameUpdateManyMutationInputSchema: z.ZodType<Prisma.GameUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  winnerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstAtZero: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GameUncheckedUpdateManyInputSchema: z.ZodType<Prisma.GameUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  winnerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstAtZero: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundCreateInputSchema: z.ZodType<Prisma.RoundCreateInput> = z.object({
  id: z.string().cuid().optional(),
  roundNumber: z.number().int(),
  createdAt: z.coerce.date().optional(),
  game: z.lazy(() => GameCreateNestedOneWithoutRoundsInputSchema),
  states: z.lazy(() => RoundPlayerStateCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundUncheckedCreateInputSchema: z.ZodType<Prisma.RoundUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  gameId: z.string(),
  roundNumber: z.number().int(),
  createdAt: z.coerce.date().optional(),
  states: z.lazy(() => RoundPlayerStateUncheckedCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundUpdateInputSchema: z.ZodType<Prisma.RoundUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.lazy(() => GameUpdateOneRequiredWithoutRoundsNestedInputSchema).optional(),
  states: z.lazy(() => RoundPlayerStateUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gameId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  states: z.lazy(() => RoundPlayerStateUncheckedUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundCreateManyInputSchema: z.ZodType<Prisma.RoundCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  gameId: z.string(),
  roundNumber: z.number().int(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RoundUpdateManyMutationInputSchema: z.ZodType<Prisma.RoundUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gameId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateCreateInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateInput> = z.object({
  id: z.string().cuid().optional(),
  lifes: z.number().int(),
  round: z.lazy(() => RoundCreateNestedOneWithoutStatesInputSchema),
  player: z.lazy(() => TrackerPlayerCreateNestedOneWithoutRoundPlayerStateInputSchema)
}).strict();

export const RoundPlayerStateUncheckedCreateInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  playerId: z.string(),
  lifes: z.number().int()
}).strict();

export const RoundPlayerStateUpdateInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  round: z.lazy(() => RoundUpdateOneRequiredWithoutStatesNestedInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUpdateOneRequiredWithoutRoundPlayerStateNestedInputSchema).optional()
}).strict();

export const RoundPlayerStateUncheckedUpdateInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateCreateManyInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  playerId: z.string(),
  lifes: z.number().int()
}).strict();

export const RoundPlayerStateUpdateManyMutationInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const TrackerListRelationFilterSchema: z.ZodType<Prisma.TrackerListRelationFilter> = z.object({
  every: z.lazy(() => TrackerWhereInputSchema).optional(),
  some: z.lazy(() => TrackerWhereInputSchema).optional(),
  none: z.lazy(() => TrackerWhereInputSchema).optional()
}).strict();

export const TrackerPlayerListRelationFilterSchema: z.ZodType<Prisma.TrackerPlayerListRelationFilter> = z.object({
  every: z.lazy(() => TrackerPlayerWhereInputSchema).optional(),
  some: z.lazy(() => TrackerPlayerWhereInputSchema).optional(),
  none: z.lazy(() => TrackerPlayerWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackerOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TrackerOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackerPlayerOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TrackerPlayerOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  displayUsername: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  displayUsername: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  displayUsername: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  idToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  idToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  idToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const VerificationCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTrackerNameFilterSchema: z.ZodType<Prisma.EnumTrackerNameFilter> = z.object({
  equals: z.lazy(() => TrackerNameSchema).optional(),
  in: z.lazy(() => TrackerNameSchema).array().optional(),
  notIn: z.lazy(() => TrackerNameSchema).array().optional(),
  not: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => NestedEnumTrackerNameFilterSchema) ]).optional(),
}).strict();

export const GameListRelationFilterSchema: z.ZodType<Prisma.GameListRelationFilter> = z.object({
  every: z.lazy(() => GameWhereInputSchema).optional(),
  some: z.lazy(() => GameWhereInputSchema).optional(),
  none: z.lazy(() => GameWhereInputSchema).optional()
}).strict();

export const GameOrderByRelationAggregateInputSchema: z.ZodType<Prisma.GameOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackerCountOrderByAggregateInputSchema: z.ZodType<Prisma.TrackerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  archived: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TrackerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  archived: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackerMinOrderByAggregateInputSchema: z.ZodType<Prisma.TrackerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  archived: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTrackerNameWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTrackerNameWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TrackerNameSchema).optional(),
  in: z.lazy(() => TrackerNameSchema).array().optional(),
  notIn: z.lazy(() => TrackerNameSchema).array().optional(),
  not: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => NestedEnumTrackerNameWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTrackerNameFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTrackerNameFilterSchema).optional()
}).strict();

export const TrackerScalarRelationFilterSchema: z.ZodType<Prisma.TrackerScalarRelationFilter> = z.object({
  is: z.lazy(() => TrackerWhereInputSchema).optional(),
  isNot: z.lazy(() => TrackerWhereInputSchema).optional()
}).strict();

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const RoundPlayerStateListRelationFilterSchema: z.ZodType<Prisma.RoundPlayerStateListRelationFilter> = z.object({
  every: z.lazy(() => RoundPlayerStateWhereInputSchema).optional(),
  some: z.lazy(() => RoundPlayerStateWhereInputSchema).optional(),
  none: z.lazy(() => RoundPlayerStateWhereInputSchema).optional()
}).strict();

export const RoundPlayerStateOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RoundPlayerStateOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackerPlayerCountOrderByAggregateInputSchema: z.ZodType<Prisma.TrackerPlayerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackerPlayerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TrackerPlayerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackerPlayerMinOrderByAggregateInputSchema: z.ZodType<Prisma.TrackerPlayerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const RoundListRelationFilterSchema: z.ZodType<Prisma.RoundListRelationFilter> = z.object({
  every: z.lazy(() => RoundWhereInputSchema).optional(),
  some: z.lazy(() => RoundWhereInputSchema).optional(),
  none: z.lazy(() => RoundWhereInputSchema).optional()
}).strict();

export const RoundOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RoundOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameCountOrderByAggregateInputSchema: z.ZodType<Prisma.GameCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  winnerId: z.lazy(() => SortOrderSchema).optional(),
  firstAtZero: z.lazy(() => SortOrderSchema).optional(),
  lastTwo: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameMaxOrderByAggregateInputSchema: z.ZodType<Prisma.GameMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  winnerId: z.lazy(() => SortOrderSchema).optional(),
  firstAtZero: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameMinOrderByAggregateInputSchema: z.ZodType<Prisma.GameMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackerId: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  winnerId: z.lazy(() => SortOrderSchema).optional(),
  firstAtZero: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const GameScalarRelationFilterSchema: z.ZodType<Prisma.GameScalarRelationFilter> = z.object({
  is: z.lazy(() => GameWhereInputSchema).optional(),
  isNot: z.lazy(() => GameWhereInputSchema).optional()
}).strict();

export const RoundGameIdRoundNumberCompoundUniqueInputSchema: z.ZodType<Prisma.RoundGameIdRoundNumberCompoundUniqueInput> = z.object({
  gameId: z.string(),
  roundNumber: z.number()
}).strict();

export const RoundCountOrderByAggregateInputSchema: z.ZodType<Prisma.RoundCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameId: z.lazy(() => SortOrderSchema).optional(),
  roundNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RoundAvgOrderByAggregateInput> = z.object({
  roundNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RoundMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameId: z.lazy(() => SortOrderSchema).optional(),
  roundNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundMinOrderByAggregateInputSchema: z.ZodType<Prisma.RoundMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameId: z.lazy(() => SortOrderSchema).optional(),
  roundNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundSumOrderByAggregateInputSchema: z.ZodType<Prisma.RoundSumOrderByAggregateInput> = z.object({
  roundNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const RoundScalarRelationFilterSchema: z.ZodType<Prisma.RoundScalarRelationFilter> = z.object({
  is: z.lazy(() => RoundWhereInputSchema).optional(),
  isNot: z.lazy(() => RoundWhereInputSchema).optional()
}).strict();

export const TrackerPlayerScalarRelationFilterSchema: z.ZodType<Prisma.TrackerPlayerScalarRelationFilter> = z.object({
  is: z.lazy(() => TrackerPlayerWhereInputSchema).optional(),
  isNot: z.lazy(() => TrackerPlayerWhereInputSchema).optional()
}).strict();

export const RoundPlayerStateCountOrderByAggregateInputSchema: z.ZodType<Prisma.RoundPlayerStateCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  lifes: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundPlayerStateAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RoundPlayerStateAvgOrderByAggregateInput> = z.object({
  lifes: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundPlayerStateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RoundPlayerStateMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  lifes: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundPlayerStateMinOrderByAggregateInputSchema: z.ZodType<Prisma.RoundPlayerStateMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  lifes: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundPlayerStateSumOrderByAggregateInputSchema: z.ZodType<Prisma.RoundPlayerStateSumOrderByAggregateInput> = z.object({
  lifes: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackerCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => TrackerCreateWithoutCreatorInputSchema),z.lazy(() => TrackerCreateWithoutCreatorInputSchema).array(),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => TrackerCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackerPlayerCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema).array(),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerPlayerCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerPlayerCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackerUncheckedCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerUncheckedCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => TrackerCreateWithoutCreatorInputSchema),z.lazy(() => TrackerCreateWithoutCreatorInputSchema).array(),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => TrackerCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackerPlayerUncheckedCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema).array(),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerPlayerCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerPlayerCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackerUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.TrackerUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackerCreateWithoutCreatorInputSchema),z.lazy(() => TrackerCreateWithoutCreatorInputSchema).array(),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => TrackerCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackerUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => TrackerUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackerUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => TrackerUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackerUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => TrackerUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackerScalarWhereInputSchema),z.lazy(() => TrackerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackerPlayerUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema).array(),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerPlayerCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackerPlayerUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerPlayerCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackerPlayerUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackerPlayerUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackerPlayerScalarWhereInputSchema),z.lazy(() => TrackerPlayerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackerUncheckedUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.TrackerUncheckedUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackerCreateWithoutCreatorInputSchema),z.lazy(() => TrackerCreateWithoutCreatorInputSchema).array(),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => TrackerCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackerUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => TrackerUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackerWhereUniqueInputSchema),z.lazy(() => TrackerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackerUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => TrackerUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackerUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => TrackerUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackerScalarWhereInputSchema),z.lazy(() => TrackerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackerPlayerUncheckedUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema).array(),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerPlayerCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackerPlayerUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerPlayerCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackerPlayerUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackerPlayerUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackerPlayerScalarWhereInputSchema),z.lazy(() => TrackerPlayerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutCreatorInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCreatorInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatorInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatorInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const TrackerPlayerCreateNestedManyWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerCreateNestedManyWithoutTrackerInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema).array(),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerPlayerCreateOrConnectWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerCreateOrConnectWithoutTrackerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerPlayerCreateManyTrackerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GameCreateNestedManyWithoutTrackerInputSchema: z.ZodType<Prisma.GameCreateNestedManyWithoutTrackerInput> = z.object({
  create: z.union([ z.lazy(() => GameCreateWithoutTrackerInputSchema),z.lazy(() => GameCreateWithoutTrackerInputSchema).array(),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GameCreateOrConnectWithoutTrackerInputSchema),z.lazy(() => GameCreateOrConnectWithoutTrackerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GameCreateManyTrackerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackerPlayerUncheckedCreateNestedManyWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedCreateNestedManyWithoutTrackerInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema).array(),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerPlayerCreateOrConnectWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerCreateOrConnectWithoutTrackerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerPlayerCreateManyTrackerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GameUncheckedCreateNestedManyWithoutTrackerInputSchema: z.ZodType<Prisma.GameUncheckedCreateNestedManyWithoutTrackerInput> = z.object({
  create: z.union([ z.lazy(() => GameCreateWithoutTrackerInputSchema),z.lazy(() => GameCreateWithoutTrackerInputSchema).array(),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GameCreateOrConnectWithoutTrackerInputSchema),z.lazy(() => GameCreateOrConnectWithoutTrackerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GameCreateManyTrackerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumTrackerNameFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTrackerNameFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TrackerNameSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutCreatorNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCreatorInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatorInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatorInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCreatorInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCreatorInputSchema),z.lazy(() => UserUpdateWithoutCreatorInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCreatorInputSchema) ]).optional(),
}).strict();

export const TrackerPlayerUpdateManyWithoutTrackerNestedInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateManyWithoutTrackerNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema).array(),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerPlayerCreateOrConnectWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerCreateOrConnectWithoutTrackerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackerPlayerUpsertWithWhereUniqueWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUpsertWithWhereUniqueWithoutTrackerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerPlayerCreateManyTrackerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackerPlayerUpdateWithWhereUniqueWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUpdateWithWhereUniqueWithoutTrackerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackerPlayerUpdateManyWithWhereWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUpdateManyWithWhereWithoutTrackerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackerPlayerScalarWhereInputSchema),z.lazy(() => TrackerPlayerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GameUpdateManyWithoutTrackerNestedInputSchema: z.ZodType<Prisma.GameUpdateManyWithoutTrackerNestedInput> = z.object({
  create: z.union([ z.lazy(() => GameCreateWithoutTrackerInputSchema),z.lazy(() => GameCreateWithoutTrackerInputSchema).array(),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GameCreateOrConnectWithoutTrackerInputSchema),z.lazy(() => GameCreateOrConnectWithoutTrackerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GameUpsertWithWhereUniqueWithoutTrackerInputSchema),z.lazy(() => GameUpsertWithWhereUniqueWithoutTrackerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GameCreateManyTrackerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GameUpdateWithWhereUniqueWithoutTrackerInputSchema),z.lazy(() => GameUpdateWithWhereUniqueWithoutTrackerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GameUpdateManyWithWhereWithoutTrackerInputSchema),z.lazy(() => GameUpdateManyWithWhereWithoutTrackerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GameScalarWhereInputSchema),z.lazy(() => GameScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackerPlayerUncheckedUpdateManyWithoutTrackerNestedInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedUpdateManyWithoutTrackerNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema).array(),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackerPlayerCreateOrConnectWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerCreateOrConnectWithoutTrackerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackerPlayerUpsertWithWhereUniqueWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUpsertWithWhereUniqueWithoutTrackerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackerPlayerCreateManyTrackerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackerPlayerWhereUniqueInputSchema),z.lazy(() => TrackerPlayerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackerPlayerUpdateWithWhereUniqueWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUpdateWithWhereUniqueWithoutTrackerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackerPlayerUpdateManyWithWhereWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUpdateManyWithWhereWithoutTrackerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackerPlayerScalarWhereInputSchema),z.lazy(() => TrackerPlayerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GameUncheckedUpdateManyWithoutTrackerNestedInputSchema: z.ZodType<Prisma.GameUncheckedUpdateManyWithoutTrackerNestedInput> = z.object({
  create: z.union([ z.lazy(() => GameCreateWithoutTrackerInputSchema),z.lazy(() => GameCreateWithoutTrackerInputSchema).array(),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GameCreateOrConnectWithoutTrackerInputSchema),z.lazy(() => GameCreateOrConnectWithoutTrackerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GameUpsertWithWhereUniqueWithoutTrackerInputSchema),z.lazy(() => GameUpsertWithWhereUniqueWithoutTrackerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GameCreateManyTrackerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GameWhereUniqueInputSchema),z.lazy(() => GameWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GameUpdateWithWhereUniqueWithoutTrackerInputSchema),z.lazy(() => GameUpdateWithWhereUniqueWithoutTrackerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GameUpdateManyWithWhereWithoutTrackerInputSchema),z.lazy(() => GameUpdateManyWithWhereWithoutTrackerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GameScalarWhereInputSchema),z.lazy(() => GameScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackerCreateNestedOneWithoutPlayersInputSchema: z.ZodType<Prisma.TrackerCreateNestedOneWithoutPlayersInput> = z.object({
  create: z.union([ z.lazy(() => TrackerCreateWithoutPlayersInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutPlayersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackerCreateOrConnectWithoutPlayersInputSchema).optional(),
  connect: z.lazy(() => TrackerWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutPlayerInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPlayerInputSchema),z.lazy(() => UserUncheckedCreateWithoutPlayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPlayerInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const RoundPlayerStateCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema).array(),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundPlayerStateCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundPlayerStateCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RoundPlayerStateUncheckedCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema).array(),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundPlayerStateCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundPlayerStateCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackerUpdateOneRequiredWithoutPlayersNestedInputSchema: z.ZodType<Prisma.TrackerUpdateOneRequiredWithoutPlayersNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackerCreateWithoutPlayersInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutPlayersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackerCreateOrConnectWithoutPlayersInputSchema).optional(),
  upsert: z.lazy(() => TrackerUpsertWithoutPlayersInputSchema).optional(),
  connect: z.lazy(() => TrackerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TrackerUpdateToOneWithWhereWithoutPlayersInputSchema),z.lazy(() => TrackerUpdateWithoutPlayersInputSchema),z.lazy(() => TrackerUncheckedUpdateWithoutPlayersInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneWithoutPlayerNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPlayerInputSchema),z.lazy(() => UserUncheckedCreateWithoutPlayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPlayerInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPlayerInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPlayerInputSchema),z.lazy(() => UserUpdateWithoutPlayerInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPlayerInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema).array(),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundPlayerStateCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundPlayerStateUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundPlayerStateCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundPlayerStateUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundPlayerStateUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundPlayerStateScalarWhereInputSchema),z.lazy(() => RoundPlayerStateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoundPlayerStateUncheckedUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema).array(),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundPlayerStateCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundPlayerStateUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundPlayerStateCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundPlayerStateUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundPlayerStateUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundPlayerStateScalarWhereInputSchema),z.lazy(() => RoundPlayerStateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackerCreateNestedOneWithoutGamesInputSchema: z.ZodType<Prisma.TrackerCreateNestedOneWithoutGamesInput> = z.object({
  create: z.union([ z.lazy(() => TrackerCreateWithoutGamesInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutGamesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackerCreateOrConnectWithoutGamesInputSchema).optional(),
  connect: z.lazy(() => TrackerWhereUniqueInputSchema).optional()
}).strict();

export const RoundCreateNestedManyWithoutGameInputSchema: z.ZodType<Prisma.RoundCreateNestedManyWithoutGameInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutGameInputSchema),z.lazy(() => RoundCreateWithoutGameInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutGameInputSchema),z.lazy(() => RoundCreateOrConnectWithoutGameInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyGameInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RoundUncheckedCreateNestedManyWithoutGameInputSchema: z.ZodType<Prisma.RoundUncheckedCreateNestedManyWithoutGameInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutGameInputSchema),z.lazy(() => RoundCreateWithoutGameInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutGameInputSchema),z.lazy(() => RoundCreateOrConnectWithoutGameInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyGameInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackerUpdateOneRequiredWithoutGamesNestedInputSchema: z.ZodType<Prisma.TrackerUpdateOneRequiredWithoutGamesNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackerCreateWithoutGamesInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutGamesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackerCreateOrConnectWithoutGamesInputSchema).optional(),
  upsert: z.lazy(() => TrackerUpsertWithoutGamesInputSchema).optional(),
  connect: z.lazy(() => TrackerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TrackerUpdateToOneWithWhereWithoutGamesInputSchema),z.lazy(() => TrackerUpdateWithoutGamesInputSchema),z.lazy(() => TrackerUncheckedUpdateWithoutGamesInputSchema) ]).optional(),
}).strict();

export const RoundUpdateManyWithoutGameNestedInputSchema: z.ZodType<Prisma.RoundUpdateManyWithoutGameNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutGameInputSchema),z.lazy(() => RoundCreateWithoutGameInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutGameInputSchema),z.lazy(() => RoundCreateOrConnectWithoutGameInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundUpsertWithWhereUniqueWithoutGameInputSchema),z.lazy(() => RoundUpsertWithWhereUniqueWithoutGameInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyGameInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundUpdateWithWhereUniqueWithoutGameInputSchema),z.lazy(() => RoundUpdateWithWhereUniqueWithoutGameInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundUpdateManyWithWhereWithoutGameInputSchema),z.lazy(() => RoundUpdateManyWithWhereWithoutGameInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoundUncheckedUpdateManyWithoutGameNestedInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateManyWithoutGameNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutGameInputSchema),z.lazy(() => RoundCreateWithoutGameInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutGameInputSchema),z.lazy(() => RoundCreateOrConnectWithoutGameInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundUpsertWithWhereUniqueWithoutGameInputSchema),z.lazy(() => RoundUpsertWithWhereUniqueWithoutGameInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyGameInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundUpdateWithWhereUniqueWithoutGameInputSchema),z.lazy(() => RoundUpdateWithWhereUniqueWithoutGameInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundUpdateManyWithWhereWithoutGameInputSchema),z.lazy(() => RoundUpdateManyWithWhereWithoutGameInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GameCreateNestedOneWithoutRoundsInputSchema: z.ZodType<Prisma.GameCreateNestedOneWithoutRoundsInput> = z.object({
  create: z.union([ z.lazy(() => GameCreateWithoutRoundsInputSchema),z.lazy(() => GameUncheckedCreateWithoutRoundsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => GameCreateOrConnectWithoutRoundsInputSchema).optional(),
  connect: z.lazy(() => GameWhereUniqueInputSchema).optional()
}).strict();

export const RoundPlayerStateCreateNestedManyWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateNestedManyWithoutRoundInput> = z.object({
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema).array(),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundPlayerStateCreateOrConnectWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundPlayerStateCreateManyRoundInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RoundPlayerStateUncheckedCreateNestedManyWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedCreateNestedManyWithoutRoundInput> = z.object({
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema).array(),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundPlayerStateCreateOrConnectWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundPlayerStateCreateManyRoundInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const GameUpdateOneRequiredWithoutRoundsNestedInputSchema: z.ZodType<Prisma.GameUpdateOneRequiredWithoutRoundsNestedInput> = z.object({
  create: z.union([ z.lazy(() => GameCreateWithoutRoundsInputSchema),z.lazy(() => GameUncheckedCreateWithoutRoundsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => GameCreateOrConnectWithoutRoundsInputSchema).optional(),
  upsert: z.lazy(() => GameUpsertWithoutRoundsInputSchema).optional(),
  connect: z.lazy(() => GameWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => GameUpdateToOneWithWhereWithoutRoundsInputSchema),z.lazy(() => GameUpdateWithoutRoundsInputSchema),z.lazy(() => GameUncheckedUpdateWithoutRoundsInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateUpdateManyWithoutRoundNestedInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateManyWithoutRoundNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema).array(),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundPlayerStateCreateOrConnectWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundPlayerStateUpsertWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUpsertWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundPlayerStateCreateManyRoundInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundPlayerStateUpdateWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUpdateWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundPlayerStateUpdateManyWithWhereWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUpdateManyWithWhereWithoutRoundInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundPlayerStateScalarWhereInputSchema),z.lazy(() => RoundPlayerStateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoundPlayerStateUncheckedUpdateManyWithoutRoundNestedInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedUpdateManyWithoutRoundNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema).array(),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundPlayerStateCreateOrConnectWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundPlayerStateUpsertWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUpsertWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundPlayerStateCreateManyRoundInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),z.lazy(() => RoundPlayerStateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundPlayerStateUpdateWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUpdateWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundPlayerStateUpdateManyWithWhereWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUpdateManyWithWhereWithoutRoundInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundPlayerStateScalarWhereInputSchema),z.lazy(() => RoundPlayerStateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoundCreateNestedOneWithoutStatesInputSchema: z.ZodType<Prisma.RoundCreateNestedOneWithoutStatesInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutStatesInputSchema),z.lazy(() => RoundUncheckedCreateWithoutStatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoundCreateOrConnectWithoutStatesInputSchema).optional(),
  connect: z.lazy(() => RoundWhereUniqueInputSchema).optional()
}).strict();

export const TrackerPlayerCreateNestedOneWithoutRoundPlayerStateInputSchema: z.ZodType<Prisma.TrackerPlayerCreateNestedOneWithoutRoundPlayerStateInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutRoundPlayerStateInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutRoundPlayerStateInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackerPlayerCreateOrConnectWithoutRoundPlayerStateInputSchema).optional(),
  connect: z.lazy(() => TrackerPlayerWhereUniqueInputSchema).optional()
}).strict();

export const RoundUpdateOneRequiredWithoutStatesNestedInputSchema: z.ZodType<Prisma.RoundUpdateOneRequiredWithoutStatesNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutStatesInputSchema),z.lazy(() => RoundUncheckedCreateWithoutStatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoundCreateOrConnectWithoutStatesInputSchema).optional(),
  upsert: z.lazy(() => RoundUpsertWithoutStatesInputSchema).optional(),
  connect: z.lazy(() => RoundWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoundUpdateToOneWithWhereWithoutStatesInputSchema),z.lazy(() => RoundUpdateWithoutStatesInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutStatesInputSchema) ]).optional(),
}).strict();

export const TrackerPlayerUpdateOneRequiredWithoutRoundPlayerStateNestedInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateOneRequiredWithoutRoundPlayerStateNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutRoundPlayerStateInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutRoundPlayerStateInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackerPlayerCreateOrConnectWithoutRoundPlayerStateInputSchema).optional(),
  upsert: z.lazy(() => TrackerPlayerUpsertWithoutRoundPlayerStateInputSchema).optional(),
  connect: z.lazy(() => TrackerPlayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TrackerPlayerUpdateToOneWithWhereWithoutRoundPlayerStateInputSchema),z.lazy(() => TrackerPlayerUpdateWithoutRoundPlayerStateInputSchema),z.lazy(() => TrackerPlayerUncheckedUpdateWithoutRoundPlayerStateInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumTrackerNameFilterSchema: z.ZodType<Prisma.NestedEnumTrackerNameFilter> = z.object({
  equals: z.lazy(() => TrackerNameSchema).optional(),
  in: z.lazy(() => TrackerNameSchema).array().optional(),
  notIn: z.lazy(() => TrackerNameSchema).array().optional(),
  not: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => NestedEnumTrackerNameFilterSchema) ]).optional(),
}).strict();

export const NestedEnumTrackerNameWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTrackerNameWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TrackerNameSchema).optional(),
  in: z.lazy(() => TrackerNameSchema).array().optional(),
  notIn: z.lazy(() => TrackerNameSchema).array().optional(),
  not: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => NestedEnumTrackerNameWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTrackerNameFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTrackerNameFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema),z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TrackerCreateWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerCreateWithoutCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  players: z.lazy(() => TrackerPlayerCreateNestedManyWithoutTrackerInputSchema).optional(),
  games: z.lazy(() => GameCreateNestedManyWithoutTrackerInputSchema).optional()
}).strict();

export const TrackerUncheckedCreateWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerUncheckedCreateWithoutCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  players: z.lazy(() => TrackerPlayerUncheckedCreateNestedManyWithoutTrackerInputSchema).optional(),
  games: z.lazy(() => GameUncheckedCreateNestedManyWithoutTrackerInputSchema).optional()
}).strict();

export const TrackerCreateOrConnectWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerCreateOrConnectWithoutCreatorInput> = z.object({
  where: z.lazy(() => TrackerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackerCreateWithoutCreatorInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const TrackerCreateManyCreatorInputEnvelopeSchema: z.ZodType<Prisma.TrackerCreateManyCreatorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TrackerCreateManyCreatorInputSchema),z.lazy(() => TrackerCreateManyCreatorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TrackerPlayerCreateWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerCreateWithoutPlayerInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  tracker: z.lazy(() => TrackerCreateNestedOneWithoutPlayersInputSchema),
  RoundPlayerState: z.lazy(() => RoundPlayerStateCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedCreateWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedCreateWithoutPlayerInput> = z.object({
  id: z.string().cuid().optional(),
  trackerId: z.string(),
  name: z.string().optional().nullable(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const TrackerPlayerCreateOrConnectWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerCreateOrConnectWithoutPlayerInput> = z.object({
  where: z.lazy(() => TrackerPlayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const TrackerPlayerCreateManyPlayerInputEnvelopeSchema: z.ZodType<Prisma.TrackerPlayerCreateManyPlayerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TrackerPlayerCreateManyPlayerInputSchema),z.lazy(() => TrackerPlayerCreateManyPlayerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TrackerUpsertWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerUpsertWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => TrackerWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TrackerUpdateWithoutCreatorInputSchema),z.lazy(() => TrackerUncheckedUpdateWithoutCreatorInputSchema) ]),
  create: z.union([ z.lazy(() => TrackerCreateWithoutCreatorInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const TrackerUpdateWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerUpdateWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => TrackerWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TrackerUpdateWithoutCreatorInputSchema),z.lazy(() => TrackerUncheckedUpdateWithoutCreatorInputSchema) ]),
}).strict();

export const TrackerUpdateManyWithWhereWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerUpdateManyWithWhereWithoutCreatorInput> = z.object({
  where: z.lazy(() => TrackerScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TrackerUpdateManyMutationInputSchema),z.lazy(() => TrackerUncheckedUpdateManyWithoutCreatorInputSchema) ]),
}).strict();

export const TrackerScalarWhereInputSchema: z.ZodType<Prisma.TrackerScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TrackerScalarWhereInputSchema),z.lazy(() => TrackerScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackerScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackerScalarWhereInputSchema),z.lazy(() => TrackerScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => EnumTrackerNameFilterSchema),z.lazy(() => TrackerNameSchema) ]).optional(),
  displayName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  archived: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TrackerPlayerUpsertWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerUpsertWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => TrackerPlayerWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TrackerPlayerUpdateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUncheckedUpdateWithoutPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const TrackerPlayerUpdateWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => TrackerPlayerWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TrackerPlayerUpdateWithoutPlayerInputSchema),z.lazy(() => TrackerPlayerUncheckedUpdateWithoutPlayerInputSchema) ]),
}).strict();

export const TrackerPlayerUpdateManyWithWhereWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateManyWithWhereWithoutPlayerInput> = z.object({
  where: z.lazy(() => TrackerPlayerScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TrackerPlayerUpdateManyMutationInputSchema),z.lazy(() => TrackerPlayerUncheckedUpdateManyWithoutPlayerInputSchema) ]),
}).strict();

export const TrackerPlayerScalarWhereInputSchema: z.ZodType<Prisma.TrackerPlayerScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TrackerPlayerScalarWhereInputSchema),z.lazy(() => TrackerPlayerScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackerPlayerScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackerPlayerScalarWhereInputSchema),z.lazy(() => TrackerPlayerScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  trackerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  creator: z.lazy(() => TrackerCreateNestedManyWithoutCreatorInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  creator: z.lazy(() => TrackerUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  creator: z.lazy(() => TrackerUpdateManyWithoutCreatorNestedInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  creator: z.lazy(() => TrackerUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  creator: z.lazy(() => TrackerCreateNestedManyWithoutCreatorInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  creator: z.lazy(() => TrackerUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  creator: z.lazy(() => TrackerUpdateManyWithoutCreatorNestedInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  creator: z.lazy(() => TrackerUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutCreatorInputSchema: z.ZodType<Prisma.UserCreateWithoutCreatorInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCreatorInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCreatorInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCreatorInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCreatorInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCreatorInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const TrackerPlayerCreateWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerCreateWithoutTrackerInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  player: z.lazy(() => UserCreateNestedOneWithoutPlayerInputSchema).optional(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedCreateWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedCreateWithoutTrackerInput> = z.object({
  id: z.string().cuid().optional(),
  playerId: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const TrackerPlayerCreateOrConnectWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerCreateOrConnectWithoutTrackerInput> = z.object({
  where: z.lazy(() => TrackerPlayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema) ]),
}).strict();

export const TrackerPlayerCreateManyTrackerInputEnvelopeSchema: z.ZodType<Prisma.TrackerPlayerCreateManyTrackerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TrackerPlayerCreateManyTrackerInputSchema),z.lazy(() => TrackerPlayerCreateManyTrackerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const GameCreateWithoutTrackerInputSchema: z.ZodType<Prisma.GameCreateWithoutTrackerInput> = z.object({
  id: z.string().cuid().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  winnerId: z.string().optional().nullable(),
  firstAtZero: z.string().optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundCreateNestedManyWithoutGameInputSchema).optional()
}).strict();

export const GameUncheckedCreateWithoutTrackerInputSchema: z.ZodType<Prisma.GameUncheckedCreateWithoutTrackerInput> = z.object({
  id: z.string().cuid().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  winnerId: z.string().optional().nullable(),
  firstAtZero: z.string().optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundUncheckedCreateNestedManyWithoutGameInputSchema).optional()
}).strict();

export const GameCreateOrConnectWithoutTrackerInputSchema: z.ZodType<Prisma.GameCreateOrConnectWithoutTrackerInput> = z.object({
  where: z.lazy(() => GameWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GameCreateWithoutTrackerInputSchema),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema) ]),
}).strict();

export const GameCreateManyTrackerInputEnvelopeSchema: z.ZodType<Prisma.GameCreateManyTrackerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => GameCreateManyTrackerInputSchema),z.lazy(() => GameCreateManyTrackerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutCreatorInputSchema: z.ZodType<Prisma.UserUpsertWithoutCreatorInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutCreatorInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCreatorInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCreatorInputSchema),z.lazy(() => UserUncheckedCreateWithoutCreatorInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutCreatorInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCreatorInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCreatorInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCreatorInputSchema) ]),
}).strict();

export const UserUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.UserUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  player: z.lazy(() => TrackerPlayerUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const TrackerPlayerUpsertWithWhereUniqueWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerUpsertWithWhereUniqueWithoutTrackerInput> = z.object({
  where: z.lazy(() => TrackerPlayerWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TrackerPlayerUpdateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUncheckedUpdateWithoutTrackerInputSchema) ]),
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutTrackerInputSchema) ]),
}).strict();

export const TrackerPlayerUpdateWithWhereUniqueWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateWithWhereUniqueWithoutTrackerInput> = z.object({
  where: z.lazy(() => TrackerPlayerWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TrackerPlayerUpdateWithoutTrackerInputSchema),z.lazy(() => TrackerPlayerUncheckedUpdateWithoutTrackerInputSchema) ]),
}).strict();

export const TrackerPlayerUpdateManyWithWhereWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateManyWithWhereWithoutTrackerInput> = z.object({
  where: z.lazy(() => TrackerPlayerScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TrackerPlayerUpdateManyMutationInputSchema),z.lazy(() => TrackerPlayerUncheckedUpdateManyWithoutTrackerInputSchema) ]),
}).strict();

export const GameUpsertWithWhereUniqueWithoutTrackerInputSchema: z.ZodType<Prisma.GameUpsertWithWhereUniqueWithoutTrackerInput> = z.object({
  where: z.lazy(() => GameWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => GameUpdateWithoutTrackerInputSchema),z.lazy(() => GameUncheckedUpdateWithoutTrackerInputSchema) ]),
  create: z.union([ z.lazy(() => GameCreateWithoutTrackerInputSchema),z.lazy(() => GameUncheckedCreateWithoutTrackerInputSchema) ]),
}).strict();

export const GameUpdateWithWhereUniqueWithoutTrackerInputSchema: z.ZodType<Prisma.GameUpdateWithWhereUniqueWithoutTrackerInput> = z.object({
  where: z.lazy(() => GameWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => GameUpdateWithoutTrackerInputSchema),z.lazy(() => GameUncheckedUpdateWithoutTrackerInputSchema) ]),
}).strict();

export const GameUpdateManyWithWhereWithoutTrackerInputSchema: z.ZodType<Prisma.GameUpdateManyWithWhereWithoutTrackerInput> = z.object({
  where: z.lazy(() => GameScalarWhereInputSchema),
  data: z.union([ z.lazy(() => GameUpdateManyMutationInputSchema),z.lazy(() => GameUncheckedUpdateManyWithoutTrackerInputSchema) ]),
}).strict();

export const GameScalarWhereInputSchema: z.ZodType<Prisma.GameScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GameScalarWhereInputSchema),z.lazy(() => GameScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameScalarWhereInputSchema),z.lazy(() => GameScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  trackerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  winnerId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  firstAtZero: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastTwo: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TrackerCreateWithoutPlayersInputSchema: z.ZodType<Prisma.TrackerCreateWithoutPlayersInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatorInputSchema),
  games: z.lazy(() => GameCreateNestedManyWithoutTrackerInputSchema).optional()
}).strict();

export const TrackerUncheckedCreateWithoutPlayersInputSchema: z.ZodType<Prisma.TrackerUncheckedCreateWithoutPlayersInput> = z.object({
  id: z.string().cuid().optional(),
  creatorId: z.string(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  games: z.lazy(() => GameUncheckedCreateNestedManyWithoutTrackerInputSchema).optional()
}).strict();

export const TrackerCreateOrConnectWithoutPlayersInputSchema: z.ZodType<Prisma.TrackerCreateOrConnectWithoutPlayersInput> = z.object({
  where: z.lazy(() => TrackerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackerCreateWithoutPlayersInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutPlayersInputSchema) ]),
}).strict();

export const UserCreateWithoutPlayerInputSchema: z.ZodType<Prisma.UserCreateWithoutPlayerInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  creator: z.lazy(() => TrackerCreateNestedManyWithoutCreatorInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPlayerInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPlayerInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().optional().nullable(),
  displayUsername: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  creator: z.lazy(() => TrackerUncheckedCreateNestedManyWithoutCreatorInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPlayerInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPlayerInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPlayerInputSchema),z.lazy(() => UserUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const RoundPlayerStateCreateWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateWithoutPlayerInput> = z.object({
  id: z.string().cuid().optional(),
  lifes: z.number().int(),
  round: z.lazy(() => RoundCreateNestedOneWithoutStatesInputSchema)
}).strict();

export const RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedCreateWithoutPlayerInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  lifes: z.number().int()
}).strict();

export const RoundPlayerStateCreateOrConnectWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateOrConnectWithoutPlayerInput> = z.object({
  where: z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const RoundPlayerStateCreateManyPlayerInputEnvelopeSchema: z.ZodType<Prisma.RoundPlayerStateCreateManyPlayerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RoundPlayerStateCreateManyPlayerInputSchema),z.lazy(() => RoundPlayerStateCreateManyPlayerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TrackerUpsertWithoutPlayersInputSchema: z.ZodType<Prisma.TrackerUpsertWithoutPlayersInput> = z.object({
  update: z.union([ z.lazy(() => TrackerUpdateWithoutPlayersInputSchema),z.lazy(() => TrackerUncheckedUpdateWithoutPlayersInputSchema) ]),
  create: z.union([ z.lazy(() => TrackerCreateWithoutPlayersInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutPlayersInputSchema) ]),
  where: z.lazy(() => TrackerWhereInputSchema).optional()
}).strict();

export const TrackerUpdateToOneWithWhereWithoutPlayersInputSchema: z.ZodType<Prisma.TrackerUpdateToOneWithWhereWithoutPlayersInput> = z.object({
  where: z.lazy(() => TrackerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TrackerUpdateWithoutPlayersInputSchema),z.lazy(() => TrackerUncheckedUpdateWithoutPlayersInputSchema) ]),
}).strict();

export const TrackerUpdateWithoutPlayersInputSchema: z.ZodType<Prisma.TrackerUpdateWithoutPlayersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatorNestedInputSchema).optional(),
  games: z.lazy(() => GameUpdateManyWithoutTrackerNestedInputSchema).optional()
}).strict();

export const TrackerUncheckedUpdateWithoutPlayersInputSchema: z.ZodType<Prisma.TrackerUncheckedUpdateWithoutPlayersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  games: z.lazy(() => GameUncheckedUpdateManyWithoutTrackerNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutPlayerInputSchema: z.ZodType<Prisma.UserUpsertWithoutPlayerInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPlayerInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPlayerInputSchema),z.lazy(() => UserUncheckedCreateWithoutPlayerInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPlayerInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPlayerInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPlayerInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPlayerInputSchema) ]),
}).strict();

export const UserUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.UserUpdateWithoutPlayerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  creator: z.lazy(() => TrackerUpdateManyWithoutCreatorNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPlayerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  displayUsername: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  creator: z.lazy(() => TrackerUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional()
}).strict();

export const RoundPlayerStateUpsertWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateUpsertWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RoundPlayerStateUpdateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUncheckedUpdateWithoutPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const RoundPlayerStateUpdateWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RoundPlayerStateUpdateWithoutPlayerInputSchema),z.lazy(() => RoundPlayerStateUncheckedUpdateWithoutPlayerInputSchema) ]),
}).strict();

export const RoundPlayerStateUpdateManyWithWhereWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateManyWithWhereWithoutPlayerInput> = z.object({
  where: z.lazy(() => RoundPlayerStateScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RoundPlayerStateUpdateManyMutationInputSchema),z.lazy(() => RoundPlayerStateUncheckedUpdateManyWithoutPlayerInputSchema) ]),
}).strict();

export const RoundPlayerStateScalarWhereInputSchema: z.ZodType<Prisma.RoundPlayerStateScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoundPlayerStateScalarWhereInputSchema),z.lazy(() => RoundPlayerStateScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundPlayerStateScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundPlayerStateScalarWhereInputSchema),z.lazy(() => RoundPlayerStateScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roundId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lifes: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const TrackerCreateWithoutGamesInputSchema: z.ZodType<Prisma.TrackerCreateWithoutGamesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCreatorInputSchema),
  players: z.lazy(() => TrackerPlayerCreateNestedManyWithoutTrackerInputSchema).optional()
}).strict();

export const TrackerUncheckedCreateWithoutGamesInputSchema: z.ZodType<Prisma.TrackerUncheckedCreateWithoutGamesInput> = z.object({
  id: z.string().cuid().optional(),
  creatorId: z.string(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  players: z.lazy(() => TrackerPlayerUncheckedCreateNestedManyWithoutTrackerInputSchema).optional()
}).strict();

export const TrackerCreateOrConnectWithoutGamesInputSchema: z.ZodType<Prisma.TrackerCreateOrConnectWithoutGamesInput> = z.object({
  where: z.lazy(() => TrackerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackerCreateWithoutGamesInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutGamesInputSchema) ]),
}).strict();

export const RoundCreateWithoutGameInputSchema: z.ZodType<Prisma.RoundCreateWithoutGameInput> = z.object({
  id: z.string().cuid().optional(),
  roundNumber: z.number().int(),
  createdAt: z.coerce.date().optional(),
  states: z.lazy(() => RoundPlayerStateCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundUncheckedCreateWithoutGameInputSchema: z.ZodType<Prisma.RoundUncheckedCreateWithoutGameInput> = z.object({
  id: z.string().cuid().optional(),
  roundNumber: z.number().int(),
  createdAt: z.coerce.date().optional(),
  states: z.lazy(() => RoundPlayerStateUncheckedCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundCreateOrConnectWithoutGameInputSchema: z.ZodType<Prisma.RoundCreateOrConnectWithoutGameInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoundCreateWithoutGameInputSchema),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema) ]),
}).strict();

export const RoundCreateManyGameInputEnvelopeSchema: z.ZodType<Prisma.RoundCreateManyGameInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RoundCreateManyGameInputSchema),z.lazy(() => RoundCreateManyGameInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TrackerUpsertWithoutGamesInputSchema: z.ZodType<Prisma.TrackerUpsertWithoutGamesInput> = z.object({
  update: z.union([ z.lazy(() => TrackerUpdateWithoutGamesInputSchema),z.lazy(() => TrackerUncheckedUpdateWithoutGamesInputSchema) ]),
  create: z.union([ z.lazy(() => TrackerCreateWithoutGamesInputSchema),z.lazy(() => TrackerUncheckedCreateWithoutGamesInputSchema) ]),
  where: z.lazy(() => TrackerWhereInputSchema).optional()
}).strict();

export const TrackerUpdateToOneWithWhereWithoutGamesInputSchema: z.ZodType<Prisma.TrackerUpdateToOneWithWhereWithoutGamesInput> = z.object({
  where: z.lazy(() => TrackerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TrackerUpdateWithoutGamesInputSchema),z.lazy(() => TrackerUncheckedUpdateWithoutGamesInputSchema) ]),
}).strict();

export const TrackerUpdateWithoutGamesInputSchema: z.ZodType<Prisma.TrackerUpdateWithoutGamesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCreatorNestedInputSchema).optional(),
  players: z.lazy(() => TrackerPlayerUpdateManyWithoutTrackerNestedInputSchema).optional()
}).strict();

export const TrackerUncheckedUpdateWithoutGamesInputSchema: z.ZodType<Prisma.TrackerUncheckedUpdateWithoutGamesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  players: z.lazy(() => TrackerPlayerUncheckedUpdateManyWithoutTrackerNestedInputSchema).optional()
}).strict();

export const RoundUpsertWithWhereUniqueWithoutGameInputSchema: z.ZodType<Prisma.RoundUpsertWithWhereUniqueWithoutGameInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RoundUpdateWithoutGameInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutGameInputSchema) ]),
  create: z.union([ z.lazy(() => RoundCreateWithoutGameInputSchema),z.lazy(() => RoundUncheckedCreateWithoutGameInputSchema) ]),
}).strict();

export const RoundUpdateWithWhereUniqueWithoutGameInputSchema: z.ZodType<Prisma.RoundUpdateWithWhereUniqueWithoutGameInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RoundUpdateWithoutGameInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutGameInputSchema) ]),
}).strict();

export const RoundUpdateManyWithWhereWithoutGameInputSchema: z.ZodType<Prisma.RoundUpdateManyWithWhereWithoutGameInput> = z.object({
  where: z.lazy(() => RoundScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RoundUpdateManyMutationInputSchema),z.lazy(() => RoundUncheckedUpdateManyWithoutGameInputSchema) ]),
}).strict();

export const RoundScalarWhereInputSchema: z.ZodType<Prisma.RoundScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gameId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roundNumber: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const GameCreateWithoutRoundsInputSchema: z.ZodType<Prisma.GameCreateWithoutRoundsInput> = z.object({
  id: z.string().cuid().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  winnerId: z.string().optional().nullable(),
  firstAtZero: z.string().optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  tracker: z.lazy(() => TrackerCreateNestedOneWithoutGamesInputSchema)
}).strict();

export const GameUncheckedCreateWithoutRoundsInputSchema: z.ZodType<Prisma.GameUncheckedCreateWithoutRoundsInput> = z.object({
  id: z.string().cuid().optional(),
  trackerId: z.string(),
  completedAt: z.coerce.date().optional().nullable(),
  winnerId: z.string().optional().nullable(),
  firstAtZero: z.string().optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const GameCreateOrConnectWithoutRoundsInputSchema: z.ZodType<Prisma.GameCreateOrConnectWithoutRoundsInput> = z.object({
  where: z.lazy(() => GameWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GameCreateWithoutRoundsInputSchema),z.lazy(() => GameUncheckedCreateWithoutRoundsInputSchema) ]),
}).strict();

export const RoundPlayerStateCreateWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateWithoutRoundInput> = z.object({
  id: z.string().cuid().optional(),
  lifes: z.number().int(),
  player: z.lazy(() => TrackerPlayerCreateNestedOneWithoutRoundPlayerStateInputSchema)
}).strict();

export const RoundPlayerStateUncheckedCreateWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedCreateWithoutRoundInput> = z.object({
  id: z.string().cuid().optional(),
  playerId: z.string(),
  lifes: z.number().int()
}).strict();

export const RoundPlayerStateCreateOrConnectWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateOrConnectWithoutRoundInput> = z.object({
  where: z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema) ]),
}).strict();

export const RoundPlayerStateCreateManyRoundInputEnvelopeSchema: z.ZodType<Prisma.RoundPlayerStateCreateManyRoundInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RoundPlayerStateCreateManyRoundInputSchema),z.lazy(() => RoundPlayerStateCreateManyRoundInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const GameUpsertWithoutRoundsInputSchema: z.ZodType<Prisma.GameUpsertWithoutRoundsInput> = z.object({
  update: z.union([ z.lazy(() => GameUpdateWithoutRoundsInputSchema),z.lazy(() => GameUncheckedUpdateWithoutRoundsInputSchema) ]),
  create: z.union([ z.lazy(() => GameCreateWithoutRoundsInputSchema),z.lazy(() => GameUncheckedCreateWithoutRoundsInputSchema) ]),
  where: z.lazy(() => GameWhereInputSchema).optional()
}).strict();

export const GameUpdateToOneWithWhereWithoutRoundsInputSchema: z.ZodType<Prisma.GameUpdateToOneWithWhereWithoutRoundsInput> = z.object({
  where: z.lazy(() => GameWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => GameUpdateWithoutRoundsInputSchema),z.lazy(() => GameUncheckedUpdateWithoutRoundsInputSchema) ]),
}).strict();

export const GameUpdateWithoutRoundsInputSchema: z.ZodType<Prisma.GameUpdateWithoutRoundsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  winnerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstAtZero: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracker: z.lazy(() => TrackerUpdateOneRequiredWithoutGamesNestedInputSchema).optional()
}).strict();

export const GameUncheckedUpdateWithoutRoundsInputSchema: z.ZodType<Prisma.GameUncheckedUpdateWithoutRoundsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  winnerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstAtZero: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateUpsertWithWhereUniqueWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateUpsertWithWhereUniqueWithoutRoundInput> = z.object({
  where: z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RoundPlayerStateUpdateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUncheckedUpdateWithoutRoundInputSchema) ]),
  create: z.union([ z.lazy(() => RoundPlayerStateCreateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUncheckedCreateWithoutRoundInputSchema) ]),
}).strict();

export const RoundPlayerStateUpdateWithWhereUniqueWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateWithWhereUniqueWithoutRoundInput> = z.object({
  where: z.lazy(() => RoundPlayerStateWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RoundPlayerStateUpdateWithoutRoundInputSchema),z.lazy(() => RoundPlayerStateUncheckedUpdateWithoutRoundInputSchema) ]),
}).strict();

export const RoundPlayerStateUpdateManyWithWhereWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateManyWithWhereWithoutRoundInput> = z.object({
  where: z.lazy(() => RoundPlayerStateScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RoundPlayerStateUpdateManyMutationInputSchema),z.lazy(() => RoundPlayerStateUncheckedUpdateManyWithoutRoundInputSchema) ]),
}).strict();

export const RoundCreateWithoutStatesInputSchema: z.ZodType<Prisma.RoundCreateWithoutStatesInput> = z.object({
  id: z.string().cuid().optional(),
  roundNumber: z.number().int(),
  createdAt: z.coerce.date().optional(),
  game: z.lazy(() => GameCreateNestedOneWithoutRoundsInputSchema)
}).strict();

export const RoundUncheckedCreateWithoutStatesInputSchema: z.ZodType<Prisma.RoundUncheckedCreateWithoutStatesInput> = z.object({
  id: z.string().cuid().optional(),
  gameId: z.string(),
  roundNumber: z.number().int(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RoundCreateOrConnectWithoutStatesInputSchema: z.ZodType<Prisma.RoundCreateOrConnectWithoutStatesInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoundCreateWithoutStatesInputSchema),z.lazy(() => RoundUncheckedCreateWithoutStatesInputSchema) ]),
}).strict();

export const TrackerPlayerCreateWithoutRoundPlayerStateInputSchema: z.ZodType<Prisma.TrackerPlayerCreateWithoutRoundPlayerStateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  tracker: z.lazy(() => TrackerCreateNestedOneWithoutPlayersInputSchema),
  player: z.lazy(() => UserCreateNestedOneWithoutPlayerInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedCreateWithoutRoundPlayerStateInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedCreateWithoutRoundPlayerStateInput> = z.object({
  id: z.string().cuid().optional(),
  trackerId: z.string(),
  playerId: z.string().optional().nullable(),
  name: z.string().optional().nullable()
}).strict();

export const TrackerPlayerCreateOrConnectWithoutRoundPlayerStateInputSchema: z.ZodType<Prisma.TrackerPlayerCreateOrConnectWithoutRoundPlayerStateInput> = z.object({
  where: z.lazy(() => TrackerPlayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutRoundPlayerStateInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutRoundPlayerStateInputSchema) ]),
}).strict();

export const RoundUpsertWithoutStatesInputSchema: z.ZodType<Prisma.RoundUpsertWithoutStatesInput> = z.object({
  update: z.union([ z.lazy(() => RoundUpdateWithoutStatesInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutStatesInputSchema) ]),
  create: z.union([ z.lazy(() => RoundCreateWithoutStatesInputSchema),z.lazy(() => RoundUncheckedCreateWithoutStatesInputSchema) ]),
  where: z.lazy(() => RoundWhereInputSchema).optional()
}).strict();

export const RoundUpdateToOneWithWhereWithoutStatesInputSchema: z.ZodType<Prisma.RoundUpdateToOneWithWhereWithoutStatesInput> = z.object({
  where: z.lazy(() => RoundWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoundUpdateWithoutStatesInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutStatesInputSchema) ]),
}).strict();

export const RoundUpdateWithoutStatesInputSchema: z.ZodType<Prisma.RoundUpdateWithoutStatesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.lazy(() => GameUpdateOneRequiredWithoutRoundsNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateWithoutStatesInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateWithoutStatesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gameId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackerPlayerUpsertWithoutRoundPlayerStateInputSchema: z.ZodType<Prisma.TrackerPlayerUpsertWithoutRoundPlayerStateInput> = z.object({
  update: z.union([ z.lazy(() => TrackerPlayerUpdateWithoutRoundPlayerStateInputSchema),z.lazy(() => TrackerPlayerUncheckedUpdateWithoutRoundPlayerStateInputSchema) ]),
  create: z.union([ z.lazy(() => TrackerPlayerCreateWithoutRoundPlayerStateInputSchema),z.lazy(() => TrackerPlayerUncheckedCreateWithoutRoundPlayerStateInputSchema) ]),
  where: z.lazy(() => TrackerPlayerWhereInputSchema).optional()
}).strict();

export const TrackerPlayerUpdateToOneWithWhereWithoutRoundPlayerStateInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateToOneWithWhereWithoutRoundPlayerStateInput> = z.object({
  where: z.lazy(() => TrackerPlayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TrackerPlayerUpdateWithoutRoundPlayerStateInputSchema),z.lazy(() => TrackerPlayerUncheckedUpdateWithoutRoundPlayerStateInputSchema) ]),
}).strict();

export const TrackerPlayerUpdateWithoutRoundPlayerStateInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateWithoutRoundPlayerStateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tracker: z.lazy(() => TrackerUpdateOneRequiredWithoutPlayersNestedInputSchema).optional(),
  player: z.lazy(() => UserUpdateOneWithoutPlayerNestedInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedUpdateWithoutRoundPlayerStateInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedUpdateWithoutRoundPlayerStateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable()
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const TrackerCreateManyCreatorInputSchema: z.ZodType<Prisma.TrackerCreateManyCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => TrackerNameSchema),
  displayName: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const TrackerPlayerCreateManyPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerCreateManyPlayerInput> = z.object({
  id: z.string().cuid().optional(),
  trackerId: z.string(),
  name: z.string().optional().nullable()
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackerUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  players: z.lazy(() => TrackerPlayerUpdateManyWithoutTrackerNestedInputSchema).optional(),
  games: z.lazy(() => GameUpdateManyWithoutTrackerNestedInputSchema).optional()
}).strict();

export const TrackerUncheckedUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerUncheckedUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  players: z.lazy(() => TrackerPlayerUncheckedUpdateManyWithoutTrackerNestedInputSchema).optional(),
  games: z.lazy(() => GameUncheckedUpdateManyWithoutTrackerNestedInputSchema).optional()
}).strict();

export const TrackerUncheckedUpdateManyWithoutCreatorInputSchema: z.ZodType<Prisma.TrackerUncheckedUpdateManyWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => TrackerNameSchema),z.lazy(() => EnumTrackerNameFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  archived: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackerPlayerUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateWithoutPlayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tracker: z.lazy(() => TrackerUpdateOneRequiredWithoutPlayersNestedInputSchema).optional(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedUpdateWithoutPlayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedUpdateManyWithoutPlayerInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedUpdateManyWithoutPlayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TrackerPlayerCreateManyTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerCreateManyTrackerInput> = z.object({
  id: z.string().cuid().optional(),
  playerId: z.string().optional().nullable(),
  name: z.string().optional().nullable()
}).strict();

export const GameCreateManyTrackerInputSchema: z.ZodType<Prisma.GameCreateManyTrackerInput> = z.object({
  id: z.string().cuid().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  winnerId: z.string().optional().nullable(),
  firstAtZero: z.string().optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const TrackerPlayerUpdateWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerUpdateWithoutTrackerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  player: z.lazy(() => UserUpdateOneWithoutPlayerNestedInputSchema).optional(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedUpdateWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedUpdateWithoutTrackerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RoundPlayerState: z.lazy(() => RoundPlayerStateUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const TrackerPlayerUncheckedUpdateManyWithoutTrackerInputSchema: z.ZodType<Prisma.TrackerPlayerUncheckedUpdateManyWithoutTrackerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GameUpdateWithoutTrackerInputSchema: z.ZodType<Prisma.GameUpdateWithoutTrackerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  winnerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstAtZero: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUpdateManyWithoutGameNestedInputSchema).optional()
}).strict();

export const GameUncheckedUpdateWithoutTrackerInputSchema: z.ZodType<Prisma.GameUncheckedUpdateWithoutTrackerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  winnerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstAtZero: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUncheckedUpdateManyWithoutGameNestedInputSchema).optional()
}).strict();

export const GameUncheckedUpdateManyWithoutTrackerInputSchema: z.ZodType<Prisma.GameUncheckedUpdateManyWithoutTrackerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  winnerId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstAtZero: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastTwo: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateCreateManyPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateManyPlayerInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  lifes: z.number().int()
}).strict();

export const RoundPlayerStateUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateWithoutPlayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  round: z.lazy(() => RoundUpdateOneRequiredWithoutStatesNestedInputSchema).optional()
}).strict();

export const RoundPlayerStateUncheckedUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedUpdateWithoutPlayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateUncheckedUpdateManyWithoutPlayerInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedUpdateManyWithoutPlayerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundCreateManyGameInputSchema: z.ZodType<Prisma.RoundCreateManyGameInput> = z.object({
  id: z.string().cuid().optional(),
  roundNumber: z.number().int(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RoundUpdateWithoutGameInputSchema: z.ZodType<Prisma.RoundUpdateWithoutGameInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  states: z.lazy(() => RoundPlayerStateUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateWithoutGameInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateWithoutGameInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  states: z.lazy(() => RoundPlayerStateUncheckedUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateManyWithoutGameInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateManyWithoutGameInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateCreateManyRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateCreateManyRoundInput> = z.object({
  id: z.string().cuid().optional(),
  playerId: z.string(),
  lifes: z.number().int()
}).strict();

export const RoundPlayerStateUpdateWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateUpdateWithoutRoundInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  player: z.lazy(() => TrackerPlayerUpdateOneRequiredWithoutRoundPlayerStateNestedInputSchema).optional()
}).strict();

export const RoundPlayerStateUncheckedUpdateWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedUpdateWithoutRoundInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundPlayerStateUncheckedUpdateManyWithoutRoundInputSchema: z.ZodType<Prisma.RoundPlayerStateUncheckedUpdateManyWithoutRoundInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lifes: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const VerificationFindFirstArgsSchema: z.ZodType<Prisma.VerificationFindFirstArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(),VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationScalarFieldEnumSchema,VerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindFirstOrThrowArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(),VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationScalarFieldEnumSchema,VerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationFindManyArgsSchema: z.ZodType<Prisma.VerificationFindManyArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(),VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationScalarFieldEnumSchema,VerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationAggregateArgsSchema: z.ZodType<Prisma.VerificationAggregateArgs> = z.object({
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(),VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationGroupByArgsSchema: z.ZodType<Prisma.VerificationGroupByArgs> = z.object({
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithAggregationInputSchema.array(),VerificationOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationScalarFieldEnumSchema.array(),
  having: VerificationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationFindUniqueArgsSchema: z.ZodType<Prisma.VerificationFindUniqueArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema,
}).strict() ;

export const VerificationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindUniqueOrThrowArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema,
}).strict() ;

export const TrackerFindFirstArgsSchema: z.ZodType<Prisma.TrackerFindFirstArgs> = z.object({
  select: TrackerSelectSchema.optional(),
  include: TrackerIncludeSchema.optional(),
  where: TrackerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerOrderByWithRelationInputSchema.array(),TrackerOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackerScalarFieldEnumSchema,TrackerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TrackerFindFirstOrThrowArgs> = z.object({
  select: TrackerSelectSchema.optional(),
  include: TrackerIncludeSchema.optional(),
  where: TrackerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerOrderByWithRelationInputSchema.array(),TrackerOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackerScalarFieldEnumSchema,TrackerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackerFindManyArgsSchema: z.ZodType<Prisma.TrackerFindManyArgs> = z.object({
  select: TrackerSelectSchema.optional(),
  include: TrackerIncludeSchema.optional(),
  where: TrackerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerOrderByWithRelationInputSchema.array(),TrackerOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackerScalarFieldEnumSchema,TrackerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackerAggregateArgsSchema: z.ZodType<Prisma.TrackerAggregateArgs> = z.object({
  where: TrackerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerOrderByWithRelationInputSchema.array(),TrackerOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackerGroupByArgsSchema: z.ZodType<Prisma.TrackerGroupByArgs> = z.object({
  where: TrackerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerOrderByWithAggregationInputSchema.array(),TrackerOrderByWithAggregationInputSchema ]).optional(),
  by: TrackerScalarFieldEnumSchema.array(),
  having: TrackerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackerFindUniqueArgsSchema: z.ZodType<Prisma.TrackerFindUniqueArgs> = z.object({
  select: TrackerSelectSchema.optional(),
  include: TrackerIncludeSchema.optional(),
  where: TrackerWhereUniqueInputSchema,
}).strict() ;

export const TrackerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TrackerFindUniqueOrThrowArgs> = z.object({
  select: TrackerSelectSchema.optional(),
  include: TrackerIncludeSchema.optional(),
  where: TrackerWhereUniqueInputSchema,
}).strict() ;

export const TrackerPlayerFindFirstArgsSchema: z.ZodType<Prisma.TrackerPlayerFindFirstArgs> = z.object({
  select: TrackerPlayerSelectSchema.optional(),
  include: TrackerPlayerIncludeSchema.optional(),
  where: TrackerPlayerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerPlayerOrderByWithRelationInputSchema.array(),TrackerPlayerOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackerPlayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackerPlayerScalarFieldEnumSchema,TrackerPlayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackerPlayerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TrackerPlayerFindFirstOrThrowArgs> = z.object({
  select: TrackerPlayerSelectSchema.optional(),
  include: TrackerPlayerIncludeSchema.optional(),
  where: TrackerPlayerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerPlayerOrderByWithRelationInputSchema.array(),TrackerPlayerOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackerPlayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackerPlayerScalarFieldEnumSchema,TrackerPlayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackerPlayerFindManyArgsSchema: z.ZodType<Prisma.TrackerPlayerFindManyArgs> = z.object({
  select: TrackerPlayerSelectSchema.optional(),
  include: TrackerPlayerIncludeSchema.optional(),
  where: TrackerPlayerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerPlayerOrderByWithRelationInputSchema.array(),TrackerPlayerOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackerPlayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackerPlayerScalarFieldEnumSchema,TrackerPlayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackerPlayerAggregateArgsSchema: z.ZodType<Prisma.TrackerPlayerAggregateArgs> = z.object({
  where: TrackerPlayerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerPlayerOrderByWithRelationInputSchema.array(),TrackerPlayerOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackerPlayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackerPlayerGroupByArgsSchema: z.ZodType<Prisma.TrackerPlayerGroupByArgs> = z.object({
  where: TrackerPlayerWhereInputSchema.optional(),
  orderBy: z.union([ TrackerPlayerOrderByWithAggregationInputSchema.array(),TrackerPlayerOrderByWithAggregationInputSchema ]).optional(),
  by: TrackerPlayerScalarFieldEnumSchema.array(),
  having: TrackerPlayerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackerPlayerFindUniqueArgsSchema: z.ZodType<Prisma.TrackerPlayerFindUniqueArgs> = z.object({
  select: TrackerPlayerSelectSchema.optional(),
  include: TrackerPlayerIncludeSchema.optional(),
  where: TrackerPlayerWhereUniqueInputSchema,
}).strict() ;

export const TrackerPlayerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TrackerPlayerFindUniqueOrThrowArgs> = z.object({
  select: TrackerPlayerSelectSchema.optional(),
  include: TrackerPlayerIncludeSchema.optional(),
  where: TrackerPlayerWhereUniqueInputSchema,
}).strict() ;

export const GameFindFirstArgsSchema: z.ZodType<Prisma.GameFindFirstArgs> = z.object({
  select: GameSelectSchema.optional(),
  include: GameIncludeSchema.optional(),
  where: GameWhereInputSchema.optional(),
  orderBy: z.union([ GameOrderByWithRelationInputSchema.array(),GameOrderByWithRelationInputSchema ]).optional(),
  cursor: GameWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GameScalarFieldEnumSchema,GameScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GameFindFirstOrThrowArgsSchema: z.ZodType<Prisma.GameFindFirstOrThrowArgs> = z.object({
  select: GameSelectSchema.optional(),
  include: GameIncludeSchema.optional(),
  where: GameWhereInputSchema.optional(),
  orderBy: z.union([ GameOrderByWithRelationInputSchema.array(),GameOrderByWithRelationInputSchema ]).optional(),
  cursor: GameWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GameScalarFieldEnumSchema,GameScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GameFindManyArgsSchema: z.ZodType<Prisma.GameFindManyArgs> = z.object({
  select: GameSelectSchema.optional(),
  include: GameIncludeSchema.optional(),
  where: GameWhereInputSchema.optional(),
  orderBy: z.union([ GameOrderByWithRelationInputSchema.array(),GameOrderByWithRelationInputSchema ]).optional(),
  cursor: GameWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GameScalarFieldEnumSchema,GameScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GameAggregateArgsSchema: z.ZodType<Prisma.GameAggregateArgs> = z.object({
  where: GameWhereInputSchema.optional(),
  orderBy: z.union([ GameOrderByWithRelationInputSchema.array(),GameOrderByWithRelationInputSchema ]).optional(),
  cursor: GameWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GameGroupByArgsSchema: z.ZodType<Prisma.GameGroupByArgs> = z.object({
  where: GameWhereInputSchema.optional(),
  orderBy: z.union([ GameOrderByWithAggregationInputSchema.array(),GameOrderByWithAggregationInputSchema ]).optional(),
  by: GameScalarFieldEnumSchema.array(),
  having: GameScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GameFindUniqueArgsSchema: z.ZodType<Prisma.GameFindUniqueArgs> = z.object({
  select: GameSelectSchema.optional(),
  include: GameIncludeSchema.optional(),
  where: GameWhereUniqueInputSchema,
}).strict() ;

export const GameFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.GameFindUniqueOrThrowArgs> = z.object({
  select: GameSelectSchema.optional(),
  include: GameIncludeSchema.optional(),
  where: GameWhereUniqueInputSchema,
}).strict() ;

export const RoundFindFirstArgsSchema: z.ZodType<Prisma.RoundFindFirstArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithRelationInputSchema.array(),RoundOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoundScalarFieldEnumSchema,RoundScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoundFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RoundFindFirstOrThrowArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithRelationInputSchema.array(),RoundOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoundScalarFieldEnumSchema,RoundScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoundFindManyArgsSchema: z.ZodType<Prisma.RoundFindManyArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithRelationInputSchema.array(),RoundOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoundScalarFieldEnumSchema,RoundScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoundAggregateArgsSchema: z.ZodType<Prisma.RoundAggregateArgs> = z.object({
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithRelationInputSchema.array(),RoundOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoundGroupByArgsSchema: z.ZodType<Prisma.RoundGroupByArgs> = z.object({
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithAggregationInputSchema.array(),RoundOrderByWithAggregationInputSchema ]).optional(),
  by: RoundScalarFieldEnumSchema.array(),
  having: RoundScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoundFindUniqueArgsSchema: z.ZodType<Prisma.RoundFindUniqueArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereUniqueInputSchema,
}).strict() ;

export const RoundFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RoundFindUniqueOrThrowArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereUniqueInputSchema,
}).strict() ;

export const RoundPlayerStateFindFirstArgsSchema: z.ZodType<Prisma.RoundPlayerStateFindFirstArgs> = z.object({
  select: RoundPlayerStateSelectSchema.optional(),
  include: RoundPlayerStateIncludeSchema.optional(),
  where: RoundPlayerStateWhereInputSchema.optional(),
  orderBy: z.union([ RoundPlayerStateOrderByWithRelationInputSchema.array(),RoundPlayerStateOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundPlayerStateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoundPlayerStateScalarFieldEnumSchema,RoundPlayerStateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoundPlayerStateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RoundPlayerStateFindFirstOrThrowArgs> = z.object({
  select: RoundPlayerStateSelectSchema.optional(),
  include: RoundPlayerStateIncludeSchema.optional(),
  where: RoundPlayerStateWhereInputSchema.optional(),
  orderBy: z.union([ RoundPlayerStateOrderByWithRelationInputSchema.array(),RoundPlayerStateOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundPlayerStateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoundPlayerStateScalarFieldEnumSchema,RoundPlayerStateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoundPlayerStateFindManyArgsSchema: z.ZodType<Prisma.RoundPlayerStateFindManyArgs> = z.object({
  select: RoundPlayerStateSelectSchema.optional(),
  include: RoundPlayerStateIncludeSchema.optional(),
  where: RoundPlayerStateWhereInputSchema.optional(),
  orderBy: z.union([ RoundPlayerStateOrderByWithRelationInputSchema.array(),RoundPlayerStateOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundPlayerStateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoundPlayerStateScalarFieldEnumSchema,RoundPlayerStateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoundPlayerStateAggregateArgsSchema: z.ZodType<Prisma.RoundPlayerStateAggregateArgs> = z.object({
  where: RoundPlayerStateWhereInputSchema.optional(),
  orderBy: z.union([ RoundPlayerStateOrderByWithRelationInputSchema.array(),RoundPlayerStateOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundPlayerStateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoundPlayerStateGroupByArgsSchema: z.ZodType<Prisma.RoundPlayerStateGroupByArgs> = z.object({
  where: RoundPlayerStateWhereInputSchema.optional(),
  orderBy: z.union([ RoundPlayerStateOrderByWithAggregationInputSchema.array(),RoundPlayerStateOrderByWithAggregationInputSchema ]).optional(),
  by: RoundPlayerStateScalarFieldEnumSchema.array(),
  having: RoundPlayerStateScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoundPlayerStateFindUniqueArgsSchema: z.ZodType<Prisma.RoundPlayerStateFindUniqueArgs> = z.object({
  select: RoundPlayerStateSelectSchema.optional(),
  include: RoundPlayerStateIncludeSchema.optional(),
  where: RoundPlayerStateWhereUniqueInputSchema,
}).strict() ;

export const RoundPlayerStateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RoundPlayerStateFindUniqueOrThrowArgs> = z.object({
  select: RoundPlayerStateSelectSchema.optional(),
  include: RoundPlayerStateIncludeSchema.optional(),
  where: RoundPlayerStateWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict() ;

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict() ;

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationCreateArgsSchema: z.ZodType<Prisma.VerificationCreateArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  data: z.union([ VerificationCreateInputSchema,VerificationUncheckedCreateInputSchema ]),
}).strict() ;

export const VerificationUpsertArgsSchema: z.ZodType<Prisma.VerificationUpsertArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema,
  create: z.union([ VerificationCreateInputSchema,VerificationUncheckedCreateInputSchema ]),
  update: z.union([ VerificationUpdateInputSchema,VerificationUncheckedUpdateInputSchema ]),
}).strict() ;

export const VerificationCreateManyArgsSchema: z.ZodType<Prisma.VerificationCreateManyArgs> = z.object({
  data: z.union([ VerificationCreateManyInputSchema,VerificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationCreateManyAndReturnArgs> = z.object({
  data: z.union([ VerificationCreateManyInputSchema,VerificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationDeleteArgsSchema: z.ZodType<Prisma.VerificationDeleteArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema,
}).strict() ;

export const VerificationUpdateArgsSchema: z.ZodType<Prisma.VerificationUpdateArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  data: z.union([ VerificationUpdateInputSchema,VerificationUncheckedUpdateInputSchema ]),
  where: VerificationWhereUniqueInputSchema,
}).strict() ;

export const VerificationUpdateManyArgsSchema: z.ZodType<Prisma.VerificationUpdateManyArgs> = z.object({
  data: z.union([ VerificationUpdateManyMutationInputSchema,VerificationUncheckedUpdateManyInputSchema ]),
  where: VerificationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationUpdateManyAndReturnArgs> = z.object({
  data: z.union([ VerificationUpdateManyMutationInputSchema,VerificationUncheckedUpdateManyInputSchema ]),
  where: VerificationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationDeleteManyArgsSchema: z.ZodType<Prisma.VerificationDeleteManyArgs> = z.object({
  where: VerificationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackerCreateArgsSchema: z.ZodType<Prisma.TrackerCreateArgs> = z.object({
  select: TrackerSelectSchema.optional(),
  include: TrackerIncludeSchema.optional(),
  data: z.union([ TrackerCreateInputSchema,TrackerUncheckedCreateInputSchema ]),
}).strict() ;

export const TrackerUpsertArgsSchema: z.ZodType<Prisma.TrackerUpsertArgs> = z.object({
  select: TrackerSelectSchema.optional(),
  include: TrackerIncludeSchema.optional(),
  where: TrackerWhereUniqueInputSchema,
  create: z.union([ TrackerCreateInputSchema,TrackerUncheckedCreateInputSchema ]),
  update: z.union([ TrackerUpdateInputSchema,TrackerUncheckedUpdateInputSchema ]),
}).strict() ;

export const TrackerCreateManyArgsSchema: z.ZodType<Prisma.TrackerCreateManyArgs> = z.object({
  data: z.union([ TrackerCreateManyInputSchema,TrackerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackerCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackerCreateManyAndReturnArgs> = z.object({
  data: z.union([ TrackerCreateManyInputSchema,TrackerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackerDeleteArgsSchema: z.ZodType<Prisma.TrackerDeleteArgs> = z.object({
  select: TrackerSelectSchema.optional(),
  include: TrackerIncludeSchema.optional(),
  where: TrackerWhereUniqueInputSchema,
}).strict() ;

export const TrackerUpdateArgsSchema: z.ZodType<Prisma.TrackerUpdateArgs> = z.object({
  select: TrackerSelectSchema.optional(),
  include: TrackerIncludeSchema.optional(),
  data: z.union([ TrackerUpdateInputSchema,TrackerUncheckedUpdateInputSchema ]),
  where: TrackerWhereUniqueInputSchema,
}).strict() ;

export const TrackerUpdateManyArgsSchema: z.ZodType<Prisma.TrackerUpdateManyArgs> = z.object({
  data: z.union([ TrackerUpdateManyMutationInputSchema,TrackerUncheckedUpdateManyInputSchema ]),
  where: TrackerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackerUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackerUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TrackerUpdateManyMutationInputSchema,TrackerUncheckedUpdateManyInputSchema ]),
  where: TrackerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackerDeleteManyArgsSchema: z.ZodType<Prisma.TrackerDeleteManyArgs> = z.object({
  where: TrackerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackerPlayerCreateArgsSchema: z.ZodType<Prisma.TrackerPlayerCreateArgs> = z.object({
  select: TrackerPlayerSelectSchema.optional(),
  include: TrackerPlayerIncludeSchema.optional(),
  data: z.union([ TrackerPlayerCreateInputSchema,TrackerPlayerUncheckedCreateInputSchema ]),
}).strict() ;

export const TrackerPlayerUpsertArgsSchema: z.ZodType<Prisma.TrackerPlayerUpsertArgs> = z.object({
  select: TrackerPlayerSelectSchema.optional(),
  include: TrackerPlayerIncludeSchema.optional(),
  where: TrackerPlayerWhereUniqueInputSchema,
  create: z.union([ TrackerPlayerCreateInputSchema,TrackerPlayerUncheckedCreateInputSchema ]),
  update: z.union([ TrackerPlayerUpdateInputSchema,TrackerPlayerUncheckedUpdateInputSchema ]),
}).strict() ;

export const TrackerPlayerCreateManyArgsSchema: z.ZodType<Prisma.TrackerPlayerCreateManyArgs> = z.object({
  data: z.union([ TrackerPlayerCreateManyInputSchema,TrackerPlayerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackerPlayerCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackerPlayerCreateManyAndReturnArgs> = z.object({
  data: z.union([ TrackerPlayerCreateManyInputSchema,TrackerPlayerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackerPlayerDeleteArgsSchema: z.ZodType<Prisma.TrackerPlayerDeleteArgs> = z.object({
  select: TrackerPlayerSelectSchema.optional(),
  include: TrackerPlayerIncludeSchema.optional(),
  where: TrackerPlayerWhereUniqueInputSchema,
}).strict() ;

export const TrackerPlayerUpdateArgsSchema: z.ZodType<Prisma.TrackerPlayerUpdateArgs> = z.object({
  select: TrackerPlayerSelectSchema.optional(),
  include: TrackerPlayerIncludeSchema.optional(),
  data: z.union([ TrackerPlayerUpdateInputSchema,TrackerPlayerUncheckedUpdateInputSchema ]),
  where: TrackerPlayerWhereUniqueInputSchema,
}).strict() ;

export const TrackerPlayerUpdateManyArgsSchema: z.ZodType<Prisma.TrackerPlayerUpdateManyArgs> = z.object({
  data: z.union([ TrackerPlayerUpdateManyMutationInputSchema,TrackerPlayerUncheckedUpdateManyInputSchema ]),
  where: TrackerPlayerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackerPlayerUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackerPlayerUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TrackerPlayerUpdateManyMutationInputSchema,TrackerPlayerUncheckedUpdateManyInputSchema ]),
  where: TrackerPlayerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackerPlayerDeleteManyArgsSchema: z.ZodType<Prisma.TrackerPlayerDeleteManyArgs> = z.object({
  where: TrackerPlayerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const GameCreateArgsSchema: z.ZodType<Prisma.GameCreateArgs> = z.object({
  select: GameSelectSchema.optional(),
  include: GameIncludeSchema.optional(),
  data: z.union([ GameCreateInputSchema,GameUncheckedCreateInputSchema ]),
}).strict() ;

export const GameUpsertArgsSchema: z.ZodType<Prisma.GameUpsertArgs> = z.object({
  select: GameSelectSchema.optional(),
  include: GameIncludeSchema.optional(),
  where: GameWhereUniqueInputSchema,
  create: z.union([ GameCreateInputSchema,GameUncheckedCreateInputSchema ]),
  update: z.union([ GameUpdateInputSchema,GameUncheckedUpdateInputSchema ]),
}).strict() ;

export const GameCreateManyArgsSchema: z.ZodType<Prisma.GameCreateManyArgs> = z.object({
  data: z.union([ GameCreateManyInputSchema,GameCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const GameCreateManyAndReturnArgsSchema: z.ZodType<Prisma.GameCreateManyAndReturnArgs> = z.object({
  data: z.union([ GameCreateManyInputSchema,GameCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const GameDeleteArgsSchema: z.ZodType<Prisma.GameDeleteArgs> = z.object({
  select: GameSelectSchema.optional(),
  include: GameIncludeSchema.optional(),
  where: GameWhereUniqueInputSchema,
}).strict() ;

export const GameUpdateArgsSchema: z.ZodType<Prisma.GameUpdateArgs> = z.object({
  select: GameSelectSchema.optional(),
  include: GameIncludeSchema.optional(),
  data: z.union([ GameUpdateInputSchema,GameUncheckedUpdateInputSchema ]),
  where: GameWhereUniqueInputSchema,
}).strict() ;

export const GameUpdateManyArgsSchema: z.ZodType<Prisma.GameUpdateManyArgs> = z.object({
  data: z.union([ GameUpdateManyMutationInputSchema,GameUncheckedUpdateManyInputSchema ]),
  where: GameWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const GameUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.GameUpdateManyAndReturnArgs> = z.object({
  data: z.union([ GameUpdateManyMutationInputSchema,GameUncheckedUpdateManyInputSchema ]),
  where: GameWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const GameDeleteManyArgsSchema: z.ZodType<Prisma.GameDeleteManyArgs> = z.object({
  where: GameWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RoundCreateArgsSchema: z.ZodType<Prisma.RoundCreateArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  data: z.union([ RoundCreateInputSchema,RoundUncheckedCreateInputSchema ]),
}).strict() ;

export const RoundUpsertArgsSchema: z.ZodType<Prisma.RoundUpsertArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereUniqueInputSchema,
  create: z.union([ RoundCreateInputSchema,RoundUncheckedCreateInputSchema ]),
  update: z.union([ RoundUpdateInputSchema,RoundUncheckedUpdateInputSchema ]),
}).strict() ;

export const RoundCreateManyArgsSchema: z.ZodType<Prisma.RoundCreateManyArgs> = z.object({
  data: z.union([ RoundCreateManyInputSchema,RoundCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoundCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RoundCreateManyAndReturnArgs> = z.object({
  data: z.union([ RoundCreateManyInputSchema,RoundCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoundDeleteArgsSchema: z.ZodType<Prisma.RoundDeleteArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereUniqueInputSchema,
}).strict() ;

export const RoundUpdateArgsSchema: z.ZodType<Prisma.RoundUpdateArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  data: z.union([ RoundUpdateInputSchema,RoundUncheckedUpdateInputSchema ]),
  where: RoundWhereUniqueInputSchema,
}).strict() ;

export const RoundUpdateManyArgsSchema: z.ZodType<Prisma.RoundUpdateManyArgs> = z.object({
  data: z.union([ RoundUpdateManyMutationInputSchema,RoundUncheckedUpdateManyInputSchema ]),
  where: RoundWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RoundUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.RoundUpdateManyAndReturnArgs> = z.object({
  data: z.union([ RoundUpdateManyMutationInputSchema,RoundUncheckedUpdateManyInputSchema ]),
  where: RoundWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RoundDeleteManyArgsSchema: z.ZodType<Prisma.RoundDeleteManyArgs> = z.object({
  where: RoundWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RoundPlayerStateCreateArgsSchema: z.ZodType<Prisma.RoundPlayerStateCreateArgs> = z.object({
  select: RoundPlayerStateSelectSchema.optional(),
  include: RoundPlayerStateIncludeSchema.optional(),
  data: z.union([ RoundPlayerStateCreateInputSchema,RoundPlayerStateUncheckedCreateInputSchema ]),
}).strict() ;

export const RoundPlayerStateUpsertArgsSchema: z.ZodType<Prisma.RoundPlayerStateUpsertArgs> = z.object({
  select: RoundPlayerStateSelectSchema.optional(),
  include: RoundPlayerStateIncludeSchema.optional(),
  where: RoundPlayerStateWhereUniqueInputSchema,
  create: z.union([ RoundPlayerStateCreateInputSchema,RoundPlayerStateUncheckedCreateInputSchema ]),
  update: z.union([ RoundPlayerStateUpdateInputSchema,RoundPlayerStateUncheckedUpdateInputSchema ]),
}).strict() ;

export const RoundPlayerStateCreateManyArgsSchema: z.ZodType<Prisma.RoundPlayerStateCreateManyArgs> = z.object({
  data: z.union([ RoundPlayerStateCreateManyInputSchema,RoundPlayerStateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoundPlayerStateCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RoundPlayerStateCreateManyAndReturnArgs> = z.object({
  data: z.union([ RoundPlayerStateCreateManyInputSchema,RoundPlayerStateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoundPlayerStateDeleteArgsSchema: z.ZodType<Prisma.RoundPlayerStateDeleteArgs> = z.object({
  select: RoundPlayerStateSelectSchema.optional(),
  include: RoundPlayerStateIncludeSchema.optional(),
  where: RoundPlayerStateWhereUniqueInputSchema,
}).strict() ;

export const RoundPlayerStateUpdateArgsSchema: z.ZodType<Prisma.RoundPlayerStateUpdateArgs> = z.object({
  select: RoundPlayerStateSelectSchema.optional(),
  include: RoundPlayerStateIncludeSchema.optional(),
  data: z.union([ RoundPlayerStateUpdateInputSchema,RoundPlayerStateUncheckedUpdateInputSchema ]),
  where: RoundPlayerStateWhereUniqueInputSchema,
}).strict() ;

export const RoundPlayerStateUpdateManyArgsSchema: z.ZodType<Prisma.RoundPlayerStateUpdateManyArgs> = z.object({
  data: z.union([ RoundPlayerStateUpdateManyMutationInputSchema,RoundPlayerStateUncheckedUpdateManyInputSchema ]),
  where: RoundPlayerStateWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RoundPlayerStateUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.RoundPlayerStateUpdateManyAndReturnArgs> = z.object({
  data: z.union([ RoundPlayerStateUpdateManyMutationInputSchema,RoundPlayerStateUncheckedUpdateManyInputSchema ]),
  where: RoundPlayerStateWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RoundPlayerStateDeleteManyArgsSchema: z.ZodType<Prisma.RoundPlayerStateDeleteManyArgs> = z.object({
  where: RoundPlayerStateWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;