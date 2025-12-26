import { initContract } from "@ts-rest/core";
import z from "zod";
import { apiError, apiSuccess } from "../types.js";
import { appOverviewSchema } from "../types/index.js";

const c = initContract();

export default c.router({
    overview: {
        method: "GET",
        path: "/app/overview",
        description: "Get application overview information",
        responses: {
            200: apiSuccess(appOverviewSchema),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
});
