import { initContract, ZodErrorSchema } from "@ts-rest/core";
import z from "zod";
import { apiError, apiSuccess } from "../types.js";
import {
    backupJobSchema,
    backupListSchema,
    backupNameSchema,
    errorBackupLimitSchema,
    errorBackupNotFoundSchema,
    errorBackupRunningSchema,
    errorServerNotFoundSchema,
    errorServerRunningSchema,
    errorServerStatusSchema,
    serverPublicIdSchema,
} from "../types/index.js";

const c = initContract();

const pathParams = z.object({
    serverPublicId: serverPublicIdSchema,
});

const backupPathParams = pathParams.extend({
    backupName: backupNameSchema,
});

const errors = {
    400: ZodErrorSchema,
    401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
    403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
    500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
};

/**
 * A backup is the server folder, /opt/<prefix>/<name>/server, as a .tar.gz. Made and restored
 * while the server is stopped. SERVER_BACKUP: list, create, download, delete the manual ones.
 * SERVER_ADMIN: restore, delete any, the automatic backup after each stop.
 */
export default c.router({
    list: {
        method: "GET",
        path: "/servers/:serverPublicId/backups",
        description:
            "List the backups of a server, newest first, with the job running",
        pathParams,
        responses: {
            200: apiSuccess(backupListSchema),
            ...errors,
            404: errorServerNotFoundSchema,
            409: errorServerStatusSchema,
        },
    },
    create: {
        method: "POST",
        path: "/servers/:serverPublicId/backups",
        description:
            "Start a manual backup, done when the serverBackupJob event says so",
        pathParams,
        body: z.undefined(),
        responses: {
            202: apiSuccess(z.object({ job: backupJobSchema })),
            ...errors,
            404: errorServerNotFoundSchema,
            409: z.union([
                errorServerRunningSchema,
                errorBackupRunningSchema,
                errorBackupLimitSchema,
                errorServerStatusSchema,
            ]),
        },
    },
    restore: {
        method: "POST",
        path: "/servers/:serverPublicId/backups/:backupName/restore",
        description:
            "Replace the server folder with the backup, after an automatic backup of it. Done when the serverBackupJob event says so",
        pathParams: backupPathParams,
        body: z.undefined(),
        responses: {
            202: apiSuccess(z.object({ job: backupJobSchema })),
            ...errors,
            404: z.union([
                errorServerNotFoundSchema,
                errorBackupNotFoundSchema,
            ]),
            409: z.union([
                errorServerRunningSchema,
                errorBackupRunningSchema,
                errorServerStatusSchema,
            ]),
        },
    },
    delete: {
        method: "DELETE",
        path: "/servers/:serverPublicId/backups/:backupName",
        description: "Delete a backup",
        pathParams: backupPathParams,
        body: z.undefined(),
        responses: {
            200: apiSuccess(z.object({})),
            ...errors,
            404: z.union([
                errorServerNotFoundSchema,
                errorBackupNotFoundSchema,
            ]),
            409: z.union([errorBackupRunningSchema, errorServerStatusSchema]),
        },
    },
    download: {
        method: "GET",
        path: "/servers/:serverPublicId/backups/:backupName/download",
        description: "Download a backup",
        pathParams: backupPathParams,
        responses: {
            200: c.otherResponse({
                contentType: "application/gzip",
                body: c.type<Blob>(),
            }),
            ...errors,
            404: z.union([
                errorServerNotFoundSchema,
                errorBackupNotFoundSchema,
            ]),
            409: errorServerStatusSchema,
        },
    },
    setAutoBackup: {
        method: "PATCH",
        path: "/servers/:serverPublicId/backups/auto",
        description: "Turn the automatic backup after each stop on or off",
        pathParams,
        body: z.object({ enabled: z.boolean() }),
        responses: {
            200: apiSuccess(z.object({ enabled: z.boolean() })),
            ...errors,
            404: errorServerNotFoundSchema,
            409: errorServerStatusSchema,
        },
    },
});
