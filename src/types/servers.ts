import z from "zod";
import { apiError } from "../types.js";
import { systemdStatusSchema } from "./systemd.js";
import { serverPublicIdSchema } from "./global.js";
import { userServerPermissionsSchema } from "./permissions.js";

export type STD = "stdout" | "stderr";

export const errorServerNotFoundSchema = apiError(
    z.literal("NOT_FOUND"),
    z.literal("Server not found")
);

export const serverStatusSchema = z.enum([
    //
    "ready",
    "maintenance",
    "archived",
]);

export type ServerStatus = z.infer<typeof serverStatusSchema>;

export const serverListEntrySchema = z.object({
    public_id: serverPublicIdSchema,
    name: z.string(),
    status: serverStatusSchema,
    serviceStatus: systemdStatusSchema,
    gameName: z.string(),
    ownerPublicId: z.string(),
});

export type ServerListEntry = z.infer<typeof serverListEntrySchema>;

export const serverInfoSchema = serverListEntrySchema.extend({
    ip: z.string(),
    startTime: z.string().datetime().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type ServerInfo = z.infer<typeof serverInfoSchema>;

export const serverInfoParsedSchema = serverListEntrySchema.extend({
    ip: z.string(),
    startTime: z.date().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type ServerInfoParsed = z.infer<typeof serverInfoParsedSchema>;

/** A file name of the server's log folder: no path, no hidden file */
export const serverLogNameSchema = z
    .string()
    .max(255)
    .regex(/^[^./\\][^/\\]*$/);

export const serverLogEntrySchema = z.object({
    name: serverLogNameSchema,
    size: z.number(),
    updated_at: z.string().datetime(),
    /** The log of the running or last session, the others are its copies */
    current: z.boolean(),
});

export type ServerLogEntry = z.infer<typeof serverLogEntrySchema>;

export const serverLogEntryParsedSchema = z.object({
    name: serverLogNameSchema,
    size: z.number(),
    updated_at: z.date(),
    current: z.boolean(),
});

export type ServerLogEntryParsed = z.infer<typeof serverLogEntryParsedSchema>;

export const errorLogNotFoundSchema = apiError(
    z.literal("NOT_FOUND"),
    z.literal("Log not found")
);

/** Lines read backwards from a byte offset: the logs only grow, the offsets stay valid */
export const serverLogPageSchema = z.object({
    lines: z.array(z.string()),
    /** Byte offset of the first line, the `before` of the previous page. 0: no older lines */
    start: z.number().int().nonnegative(),
    /** Size of the file when it was read */
    size: z.number().int().nonnegative(),
});

export type ServerLogPage = z.infer<typeof serverLogPageSchema>;

export const serverContextSchema = z.object({
    server: serverInfoSchema,
    permissions: userServerPermissionsSchema,
});

export type ServerContext = z.infer<typeof serverContextSchema>;

export const serverContextParsedSchema = z.object({
    server: serverInfoParsedSchema,
    permissions: userServerPermissionsSchema,
});

export type ServerContextParsed = z.infer<typeof serverContextParsedSchema>;
