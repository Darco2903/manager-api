import { initContract, ZodErrorSchema } from "@ts-rest/core";
import z from "zod";
import { apiError, apiSuccess } from "../types.js";
import {
    errorServerNotFoundSchema,
    errorServerStatusSchema,
    errorGameUnavailableSchema,
    errorGamePlayerNotFoundSchema,
    errorGameNotSupportedSchema,
    serverPublicIdSchema,
    gameInfoSchema,
    gamePlayerSchema,
    gamePlayerInfoSchema,
    gamePlayerActionSchema,
    gameMessageSchema,
} from "../types/index.js";

const c = initContract();

const errors = {
    400: ZodErrorSchema,
    401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
    403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
    404: z.union([errorServerNotFoundSchema, errorGamePlayerNotFoundSchema]),
    500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
    501: errorGameNotSupportedSchema,
    503: errorGameUnavailableSchema,
};

/** Reads need SERVER_METRICS, actions SERVER_CONSOLE (they could be done with console commands) */
export default c.router({
    info: {
        method: "GET",
        path: "/servers/:serverPublicId/game",
        description:
            "Get what the game supports, its status and its online players",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        responses: {
            200: apiSuccess(gameInfoSchema),
            ...errors,
        },
    },

    player: {
        method: "GET",
        path: "/servers/:serverPublicId/game/players/:player",
        description: "Get an online player",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
            player: gamePlayerSchema,
        }),
        responses: {
            200: apiSuccess(z.object({ player: gamePlayerInfoSchema })),
            ...errors,
        },
    },

    playerAction: {
        method: "POST",
        path: "/servers/:serverPublicId/game/players/:player/action",
        description:
            "Kick an online player, set their gamemode or send them a message",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
            player: gamePlayerSchema,
        }),
        body: gamePlayerActionSchema,
        responses: {
            200: apiSuccess(z.object({})),
            ...errors,
            409: errorServerStatusSchema,
        },
    },

    broadcast: {
        method: "POST",
        path: "/servers/:serverPublicId/game/broadcast",
        description: "Send a message to every player",
        pathParams: z.object({
            serverPublicId: serverPublicIdSchema,
        }),
        body: z.object({
            message: gameMessageSchema,
        }),
        responses: {
            200: apiSuccess(z.object({})),
            ...errors,
            409: errorServerStatusSchema,
        },
    },
});
