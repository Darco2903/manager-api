import { initContract, ZodErrorSchema } from "@ts-rest/core";
import { z } from "zod";
import { apiError, apiSuccess } from "../types.js";
import {
    errorServerNotFoundSchema,
    serverPublicIdSchema,
    serverListEntrySchema,
    serverInfoSchema,
    serverLogEntrySchema,
} from "../types/servers.js";
import { systemdStatusSchema } from "../common.js";

const c = initContract();

export default c.router({
    list: {
        method: "GET",
        path: "/servers/list",
        description: "Get a list of all servers",
        responses: {
            200: apiSuccess(
                z.object({
                    servers: z.array(serverListEntrySchema),
                })
            ),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    info: {
        method: "GET",
        path: "/servers/info/:serverPublicId",
        description: "Get information about a specific server",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        responses: {
            200: apiSuccess(
                z.object({
                    server: serverInfoSchema,
                })
            ),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    status: {
        method: "GET",
        path: "/servers/status/:serverPublicId",
        description: "Get the status of a specific server",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        responses: {
            200: apiSuccess(
                z.object({
                    serviceStatus: systemdStatusSchema,
                })
            ),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    listLogs: {
        method: "GET",
        path: "/servers/:serverPublicId/logs",
        description: "Get logs for a specific server",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        responses: {
            200: apiSuccess(
                z.object({
                    logs: z.array(serverLogEntrySchema),
                })
            ),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    users: {
        method: "GET",
        path: "/servers/:serverPublicId/users",
        description: "Get users with access to a specific server",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        responses: {
            200: apiSuccess(
                z.object({
                    users: z.array(z.string()),
                })
            ),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    start: {
        method: "POST",
        path: "/servers/start/:serverPublicId",
        description: "Start a specific server",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        body: z.undefined(),
        responses: {
            200: apiSuccess(
                z.object({
                    success: z.boolean(),
                    error: z.string().optional(),
                })
            ),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    stop: {
        method: "POST",
        path: "/servers/stop/:serverPublicId",
        description: "Stop a specific server",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        body: z.undefined(),
        responses: {
            200: apiSuccess(
                z.object({
                    success: z.boolean(),
                    error: z.string().optional(),
                })
            ),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    restart: {
        method: "POST",
        path: "/servers/restart/:serverPublicId",
        description: "Restart a specific server",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        body: z.undefined(),
        responses: {
            200: apiSuccess(
                z.object({
                    success: z.boolean(),
                    error: z.string().optional(),
                })
            ),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
});
