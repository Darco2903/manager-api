import { initContract, ZodErrorSchema } from "@ts-rest/core";
import z from "zod";
import { apiError, apiSuccess } from "../types.js";
import {
    errorServerNotFoundSchema,
    serverPublicIdSchema,
} from "../types/index.js";

const c = initContract();

export default c.router({
    command: {
        method: "POST",
        path: "/console/command",
        description: "Send a console command to the server",
        body: z.object({
            serverPublicId: serverPublicIdSchema,
            command: z.string().nonempty(),
        }),
        responses: {
            200: apiSuccess(z.any()),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
    output: {
        method: "GET",
        path: "/console/output",
        query: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        responses: {
            200: apiSuccess(
                z.object({
                    data: z.string(),
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
