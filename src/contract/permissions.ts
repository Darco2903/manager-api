import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { apiError, apiSuccess } from "../types.js";
import { userServerPermissionsSchema } from "../types/index.js";

const c = initContract();

export default c.router({
    getUserServerPermissions: {
        method: "GET",
        path: "/permissions/user/:userPublicId/server/:serverPublicId",
        description: "Get user server permissions",
        responses: {
            200: apiSuccess(userServerPermissionsSchema),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
    setUserServerPermissions: {
        method: "PATCH",
        path: "/permissions/user/server",
        description: "Set user server permissions",
        query: z.object({
            softUpdate: z.coerce
                .boolean()
                .default(false)
                .describe(
                    "If true, will only add new permissions, not remove existing ones"
                ),
        }),
        body: userServerPermissionsSchema,
        responses: {
            200: apiSuccess(z.object({})),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
});
