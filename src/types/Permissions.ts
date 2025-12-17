import z from "zod";

export const permissionUserSchema = z.enum([
    "ADMIN",
    "USER_CREATE_GROUP",
    "USER_CREATE_SERVER",
]);

export type PermissionUser = z.infer<typeof permissionUserSchema>;

export const permissionGroupSchema = z.enum([
    "GROUP_ADMIN",
    "GROUP_EDIT",
    "GROUP_DELETE",
    "GROUP_ADD_USER",
    "GROUP_REMOVE_USER",
    "GROUP_MANAGE_PERMISSIONS",
]);

export type PermissionGroup = z.infer<typeof permissionGroupSchema>;

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
    "SERVER_GROUPS_MANAGE",
    "SERVER_USERS_PERMISSIONS",
    "SERVER_BACKUP",
    "SERVER_RESTORE",
]);

export type PermissionServer = z.infer<typeof permissionServerSchema>;

export const permissionSchema = z.union([
    permissionUserSchema,
    permissionGroupSchema,
    permissionServerSchema,
]);

export type Permission = z.infer<typeof permissionSchema>;

export const userServerPermissionsSchema = z.object({
    userId: z.string(),
    serverId: z.string(),
    permissions: z.array(permissionServerSchema),
});

export type UserServerPermissions = z.infer<typeof userServerPermissionsSchema>;
