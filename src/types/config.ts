import z from "zod";
import { apiError } from "../types.js";

/** A key of the config file, as server.properties writes them: letters, digits, ".", "-" and "_" */
export const serverConfigKeySchema = z
    .string()
    .min(1)
    .max(128)
    .regex(/^[A-Za-z0-9._-]+$/, { message: "Invalid key" });

/**
 * A value, unescaped: the server escapes it for the file. A line break is kept (the two lines of a
 * motd), no other control character.
 */
export const serverConfigValueSchema = z
    .string()
    .max(1024)
    .refine((value) => !/[\x00-\x09\x0b-\x1f\x7f]/.test(value), {
        message: "Invalid value",
    });

/** The config of a server, server.properties for Minecraft */
export const serverConfigSchema = z.object({
    /** The file of the values, in the server folder */
    file: z.string(),
    /** Every key of the file, unescaped. Empty before the first start */
    values: z.record(serverConfigKeySchema, z.string()),
    /** Set by the admin (locked.properties): written at each start, never changed here */
    locked: z.record(serverConfigKeySchema, z.string()),
    /** Changed with SERVER_ADMIN only */
    adminOnly: z.array(serverConfigKeySchema),
    /** Sent back when saving: the save fails if the file changed since. Null while it doesn't exist */
    updated_at: z.string().datetime().nullable(),
});

export type ServerConfig = z.infer<typeof serverConfigSchema>;

/** A locked key, or an admin only one without SERVER_ADMIN */
export const errorConfigLockedSchema = apiError(
    z.literal("CONFIG_LOCKED"),
    z.string()
);
