import z from "zod";
import { userPublicIdSchema } from "@darco2903/auth-api/client";
import { apiError } from "../types.js";
import { serverPublicIdSchema } from "./global.js";
import { permissionServerSchema, permissionUserSchema } from "./permissions.js";

export const errorUserNotFoundSchema = apiError(
    z.literal("NOT_FOUND"),
    z.literal("User not found")
);

export const userServerRefSchema = z.object({
    serverPublicId: serverPublicIdSchema,
    name: z.string(),
});

export type UserServerRef = z.infer<typeof userServerRefSchema>;

export const userServerAccessSchema = userServerRefSchema.extend({
    permissions: z.array(permissionServerSchema),
});

export type UserServerAccess = z.infer<typeof userServerAccessSchema>;

/** A user known to the manager: an owner, or someone with a permission */
export const userAccessSchema = z.object({
    userPublicId: userPublicIdSchema,
    permissions: z.array(permissionUserSchema),
    owned: z.array(userServerRefSchema),
    servers: z.array(userServerAccessSchema),
});

export type UserAccess = z.infer<typeof userAccessSchema>;
