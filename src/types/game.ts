import z from "zod";
import { apiError } from "../types.js";

/**
 * The game data of a server, from the ServerManagerAPI mod/plugin in it (Minecraft: Paper, Spigot,
 * Forge, Fabric). The manager reaches it through /run/web-manager/<service>/api.sock.
 */

/** A player name, or a UUID */
export const gamePlayerSchema = z
    .string()
    .min(1)
    .max(36)
    .regex(/^[A-Za-z0-9_.-]+$/);

export const gamemodeSchema = z.enum([
    //
    "survival",
    "creative",
    "adventure",
    "spectator",
]);

export type Gamemode = z.infer<typeof gamemodeSchema>;

export const gameVec3Schema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
});

export const gameWorldStatusSchema = z.object({
    /** e.g. "minecraft:overworld" */
    id: z.string(),
    loadedChunks: z.number(),
    entities: z.number(),
    players: z.number(),
});

export const gameStatusSchema = z.object({
    tps: z.number(),
    /** null when the server doesn't measure it */
    mspt: z.number().nullable(),
    playerCount: z.number(),
    maxPlayers: z.number(),
    /** Bytes */
    memoryUsed: z.number(),
    memoryMax: z.number(),
    worlds: z.array(gameWorldStatusSchema),
});

export type GameStatus = z.infer<typeof gameStatusSchema>;

export const gameItemSchema = z.object({
    /** e.g. "minecraft:diamond_sword" */
    id: z.string(),
    count: z.number(),
});

export type GameItem = z.infer<typeof gameItemSchema>;

export const gameInventorySchema = z.object({
    /** 36 slots, the hotbar first, null when empty */
    main: z.array(gameItemSchema.nullable()),
    head: gameItemSchema.nullable(),
    chest: gameItemSchema.nullable(),
    legs: gameItemSchema.nullable(),
    feet: gameItemSchema.nullable(),
    offhand: gameItemSchema.nullable(),
});

export const gamePlayerInfoSchema = z.object({
    uuid: z.string(),
    name: z.string(),
    ping: z.number(),
    op: z.boolean(),
    gamemode: gamemodeSchema,
    world: z.string(),
    pos: gameVec3Schema,
    yaw: z.number(),
    pitch: z.number(),
    health: z.number(),
    maxHealth: z.number(),
    food: z.number(),
    saturation: z.number(),
    /** Armor points, 0-30 */
    armor: z.number(),
    xpLevel: z.number(),
    /** Towards the next level, 0-1 */
    xpProgress: z.number(),
    /** null if the player never died */
    lastDeath: z.object({ world: z.string(), pos: gameVec3Schema }).nullable(),
    inventory: gameInventorySchema,
});

export type GamePlayerInfo = z.infer<typeof gamePlayerInfoSchema>;

export const gameInfoSchema = z.object({
    /** What the mod/plugin supports on this server, e.g. "players", "kick", "gamemode" */
    capabilities: z.array(z.string()),
    /** null without the "status" capability */
    status: gameStatusSchema.nullable(),
    /** Names of the online players */
    players: z.array(z.string()),
});

export type GameInfo = z.infer<typeof gameInfoSchema>;

const playerEventSchema = z.object({
    name: z.string(),
    uuid: z.string(),
});

/** time: Unix milliseconds */
export const gameEventSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("status"),
        time: z.number(),
        data: gameStatusSchema,
    }),
    z.object({
        type: z.literal("player_join"),
        time: z.number(),
        data: playerEventSchema,
    }),
    z.object({
        type: z.literal("player_leave"),
        time: z.number(),
        data: playerEventSchema,
    }),
    z.object({
        type: z.literal("chat"),
        time: z.number(),
        data: playerEventSchema.extend({ message: z.string() }),
    }),
    z.object({
        type: z.literal("death"),
        time: z.number(),
        /** The death message, e.g. "Steve fell from a high place" */
        data: playerEventSchema.extend({ message: z.string() }),
    }),
    z.object({
        type: z.literal("advancement"),
        time: z.number(),
        /** e.g. "minecraft:story/mine_stone" */
        data: playerEventSchema.extend({ advancement: z.string() }),
    }),
    z.object({
        type: z.literal("server_stopping"),
        time: z.number(),
        data: z.null(),
    }),
]);

export type GameEvent = z.infer<typeof gameEventSchema>;

/** Kept short: the game shows them on one line */
export const GAME_MESSAGE_MAX_LENGTH = 256;

export const gameMessageSchema = z
    .string()
    .trim()
    .min(1)
    .max(GAME_MESSAGE_MAX_LENGTH);

export const gamePlayerActionSchema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("kick"),
        reason: z.string().max(GAME_MESSAGE_MAX_LENGTH).optional(),
    }),
    z.object({ action: z.literal("gamemode"), gamemode: gamemodeSchema }),
    z.object({ action: z.literal("message"), message: gameMessageSchema }),
]);

export type GamePlayerAction = z.infer<typeof gamePlayerActionSchema>;

/** The server isn't running, or has no ServerManagerAPI (or isn't configured for the manager) */
export const errorGameUnavailableSchema = apiError(
    z.literal("GAME_UNAVAILABLE"),
    z.string()
);

export const errorGamePlayerNotFoundSchema = apiError(
    z.literal("PLAYER_NOT_FOUND"),
    z.literal("Player not found")
);

/** The mod/plugin of this server doesn't support it, see the capabilities */
export const errorGameNotSupportedSchema = apiError(
    z.literal("NOT_SUPPORTED"),
    z.string()
);
