import { initContract } from "@ts-rest/core";
import z from "zod";
import { apiError, apiSuccess } from "../types.js";
import { checksReportSchema } from "../types/index.js";

const c = initContract();

/** For the app admins */
export default c.router({
    run: {
        method: "GET",
        path: "/checks",
        description: "Check every feature of the manager, and of each server, now",
        responses: {
            200: apiSuccess(checksReportSchema),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
});
