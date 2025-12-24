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
    startTime: z.date().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type ServerInfo = z.infer<typeof serverInfoSchema>;

export const serverLogEntrySchema = z.object({
    name: z.string(),
    size: z.number(),
    updated_at: z.date(),
});

export type ServerLogEntry = z.infer<typeof serverLogEntrySchema>;

export const serverContextSchema = z.object({
    server: serverInfoSchema,
    permissions: userServerPermissionsSchema,
});

export type ServerContext = z.infer<typeof serverContextSchema>;
