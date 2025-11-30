import z from "zod";
import { apiError } from "../types.js";
import { systemdStatusSchema } from "./systemd.js";

export type STD = "stdout" | "stderr";

export const serverIdSchema = z.string().length(8);

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
    public_id: serverIdSchema,
    name: z.string(),
    status: serverStatusSchema,
    serviceStatus: systemdStatusSchema,
    gameName: z.string(),
});

export type ServerListEntry = z.infer<typeof serverListEntrySchema>;

export const serverInfoSchema = serverListEntrySchema.extend({
    owner_id: z.string(),
    ip: z.string(),
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
