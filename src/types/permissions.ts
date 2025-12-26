import z from "zod";
import { userPublicIdSchema } from "@darco2903/auth-api/client";
import { serverPublicIdSchema } from "./global.js";

export const permissionUserSchema = z.enum([
    //
    "USER_CREATE_SERVER",
]);

export type PermissionUser = z.infer<typeof permissionUserSchema>;

export const permissionServerSchema = z.enum([
    "SERVER_ADMIN",
    "SERVER_DELETE",
    "SERVER_VIEW",
    "SERVER_START",
    "SERVER_STOP_RESTART",
    "SERVER_CONSOLE",
    "SERVER_LOGS",
    "SERVER_METRICS",
    "SERVER_SETTINGS",
    "SERVER_FILES",
    "SERVER_BACKUP",
    "SERVER_RESTORE",
]);

export type PermissionServer = z.infer<typeof permissionServerSchema>;

export const permissionSchema = z.union([
    permissionUserSchema,
    permissionServerSchema,
]);

export type Permission = z.infer<typeof permissionSchema>;

export const userPermissionsSchema = z.object({
    userPublicId: userPublicIdSchema,
    permissions: z.array(permissionUserSchema),
});

export type UserPermissions = z.infer<typeof userPermissionsSchema>;

export const userServerPermissionsSchema = z.object({
    userPublicId: userPublicIdSchema,
    serverPublicId: serverPublicIdSchema,
    permissions: z.array(permissionServerSchema),
});

export type UserServerPermissions = z.infer<typeof userServerPermissionsSchema>;
