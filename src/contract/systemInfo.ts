import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { apiError, apiSuccess } from "../types.js";
import { SystemInfoSchema } from "../types/systemInfo.js";

const c = initContract();

export default c.router({
    systemInfo: {
        method: "GET",
        path: "/sys-info",
        description: "Get system information",
        responses: {
            200: apiSuccess(SystemInfoSchema),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
});
