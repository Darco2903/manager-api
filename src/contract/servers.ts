import { initContract, ZodErrorSchema } from "@ts-rest/core";
import { z } from "zod";
import { apiError, apiSuccess } from "../types.js";
import {
    errorServerNotFoundSchema,
    serverIdSchema,
    serverListEntrySchema,
    serverInfoSchema,
} from "../types/servers.js";

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
        path: "/servers/info/:serverId",
        description: "Get information about a specific server",
        pathParams: z.object({
            serverId: serverIdSchema,
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
});
