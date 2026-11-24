import { initContract, ZodErrorSchema } from "@ts-rest/core";
import z from "zod";
import { apiError, apiSuccess } from "../types.js";
import {
    errorServerNotFoundSchema,
    errorServerStatusSchema,
    errorGameNotSupportedSchema,
    errorFileNotFoundSchema,
    errorInvalidPathSchema,
    errorFileExistsSchema,
    errorFileChangedSchema,
    errorFileTooLargeSchema,
    errorNotTextSchema,
    errorConfigLockedSchema,
    serverPublicIdSchema,
    serverConfigSchema,
    serverConfigKeySchema,
    serverConfigValueSchema,
} from "../types/index.js";

const c = initContract();

const pathParams = z.object({
    serverPublicId: serverPublicIdSchema,
});

/**
 * The config of the server, with SERVER_SETTINGS: Minecraft only, NOT_SUPPORTED for the other games.
 * Its status rules apply like for the other actions, and an archived server is read only. The game
 * reads it at start: a save applies at the next one.
 */
export default c.router({
    read: {
        method: "GET",
        path: "/servers/:serverPublicId/config",
        description: "Read the config of the server",
        pathParams,
        responses: {
            200: apiSuccess(serverConfigSchema),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            409: errorServerStatusSchema,
            413: errorFileTooLargeSchema,
            415: errorNotTextSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
            501: errorGameNotSupportedSchema,
        },
    },

    write: {
        method: "PUT",
        path: "/servers/:serverPublicId/config",
        description:
            "Change values of the config, the other lines of the file are kept. The locked values are written too",
        pathParams,
        body: z.object({
            /** Only the changed keys */
            values: z.record(serverConfigKeySchema, serverConfigValueSchema),
            /** The updated_at it was read with, null to create it: the save fails if it changed since */
            updated_at: z.string().datetime().nullable(),
        }),
        responses: {
            200: apiSuccess(serverConfigSchema),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: z.union([
                apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
                errorConfigLockedSchema,
            ]),
            404: z.union([errorServerNotFoundSchema, errorFileNotFoundSchema]),
            409: z.union([
                errorServerStatusSchema,
                errorFileExistsSchema,
                errorFileChangedSchema,
            ]),
            413: errorFileTooLargeSchema,
            415: errorNotTextSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
            501: errorGameNotSupportedSchema,
        },
    },
});
