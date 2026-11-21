import z from "zod";
import { userPublicIdSchema } from "@darco2903/auth-api/client";
import { apiError } from "../types.js";
import { serverPublicIdSchema } from "./global.js";
import { serverStatusSchema } from "./servers.js";

/** servers.runtime: how the server is started, stopped and watched */
export const serverRuntimeSchema = z.enum(["systemd", "docker"]);

export type ServerRuntime = z.infer<typeof serverRuntimeSchema>;

/**
 * A game's service prefix or a server's service: they make its unit (prefix@service), its container and
 * its folder (/opt/games/<prefix>/<service>), so no path, no option and no unit separator
 */
export const serviceNameSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{0,15}$/);

export const gameIdSchema = z.number().int().positive().max(65535);

export const errorGameNotFoundSchema = apiError(
    z.literal("NOT_FOUND"),
    z.literal("Game not found")
);

export const errorGameInUseSchema = apiError(
    z.literal("GAME_IN_USE"),
    z.literal("Servers still use this game")
);

/** servers.unique_game_service */
export const errorServiceTakenSchema = apiError(
    z.literal("SERVICE_TAKEN"),
    z.literal("A server of this game already has this service")
);

export const adminGameSchema = z.object({
    id: gameIdSchema,
    name: z.string(),
    servicePrefix: serviceNameSchema,
    serverCount: z.number().int().nonnegative(),
});

export type AdminGame = z.infer<typeof adminGameSchema>;

export const adminGameBodySchema = z.object({
    name: z.string().trim().min(1).max(64),
    servicePrefix: serviceNameSchema,
});

export type AdminGameBody = z.infer<typeof adminGameBodySchema>;

/** A row of servers, as the app admins edit it */
export const adminServerSchema = z.object({
    publicId: serverPublicIdSchema,
    name: z.string(),
    gameId: gameIdSchema,
    service: serviceNameSchema,
    ip: z.string(),
    ownerPublicId: userPublicIdSchema,
    runtime: serverRuntimeSchema,
    status: serverStatusSchema,
    autoBackup: z.boolean(),
});

export type AdminServer = z.infer<typeof adminServerSchema>;

/** The game and the service are set once: changing them would move the server's folder and unit */
export const adminServerUpdateSchema = z
    .object({
        name: z.string().trim().min(1).max(64),
        ip: z.string().trim().min(1).max(64),
        ownerPublicId: userPublicIdSchema,
        runtime: serverRuntimeSchema,
        status: serverStatusSchema,
        autoBackup: z.boolean(),
    })
    .partial();

export type AdminServerUpdate = z.infer<typeof adminServerUpdateSchema>;

/** Only the database row: its files, unit or container must already exist on the host */
export const adminServerCreateSchema = z.object({
    name: z.string().trim().min(1).max(64),
    gameId: gameIdSchema,
    service: serviceNameSchema,
    ip: z.string().trim().min(1).max(64),
    ownerPublicId: userPublicIdSchema,
    runtime: serverRuntimeSchema,
    status: serverStatusSchema.default("setup"),
    autoBackup: z.boolean().default(false),
});

export type AdminServerCreate = z.input<typeof adminServerCreateSchema>;
