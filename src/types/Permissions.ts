import z from "zod";

export const PermissionSchema = z.enum([
    "ADMIN",
    "GROUP_ADMIN",
    "GROUP_EDIT",
    "GROUP_DELETE",
    "GROUP_ADD_USER",
    "GROUP_REMOVE_USER",
    "GROUP_MANAGE_PERMISSIONS",
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
    "USER_CREATE_GROUP",
    "USER_CREATE_SERVER",
]);

export type Permission = z.infer<typeof PermissionSchema>;
