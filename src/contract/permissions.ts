import { initContract } from "@ts-rest/core";
import z from "zod";
import { userPublicIdSchema } from "@darco2903/auth-api/client";
import { apiError, apiSuccess } from "../types.js";
import {
    serverPublicIdSchema,
    userServerPermissionsSchema,
} from "../types/index.js";

const c = initContract();

export default c.router({
    // setUserPermissions: {
    //     method: "PATCH",
    //     path: "/permissions/user",
    //     description: "Set user permissions",
    //     body: z.object({
    //         userPublicId: z.string(),
    //         permissions: z.array(z.string()),
    //     }),
    //     responses: {
    //         200: apiSuccess(z.object({})),
    //         401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
    //         403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
    //         500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
    //     },
    // },
    // getUserPermissions: {
    //     method: "GET",
    //     path: "/permissions/user",
    //     description: "Get user permissions",
    //     responses: {
    //         200: apiSuccess(z.object({})),
    //         401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
    //         403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
    //         500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
    //     },
    // },
    getUserServerPermissions: {
        method: "GET",
        path: "/permissions/user/:userPublicId/server/:serverPublicId",
        pathParams: z.object({
            userPublicId: userPublicIdSchema,
            serverPublicId: serverPublicIdSchema,
        }),
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
            200: apiSuccess(userServerPermissionsSchema),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.string()),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
});
