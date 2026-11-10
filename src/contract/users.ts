import { initContract, ZodErrorSchema } from "@ts-rest/core";
import z from "zod";
import { userPublicIdSchema } from "@darco2903/auth-api/client";
import { apiError, apiSuccess } from "../types.js";
import { errorUserNotFoundSchema, userAccessSchema } from "../types/index.js";

const c = initContract();

/** For the app admins */
export default c.router({
    list: {
        method: "GET",
        path: "/users",
        description: "Get the users known to the manager, with their servers and permissions",
        responses: {
            200: apiSuccess(
                z.object({
                    users: z.array(userAccessSchema),
                })
            ),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
    removeAccess: {
        method: "DELETE",
        path: "/users/:userPublicId/access",
        description:
            "Remove the user from every server and clear their app permissions. The servers they own stay theirs",
        pathParams: z.object({
            userPublicId: userPublicIdSchema,
        }),
        body: z.undefined(),
        responses: {
            200: apiSuccess(userAccessSchema),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.string()),
            404: errorUserNotFoundSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
});
