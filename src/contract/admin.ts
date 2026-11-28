import { initContract, ZodErrorSchema } from "@ts-rest/core";
import z from "zod";
import { apiError, apiSuccess } from "../types.js";
import {
    adminGameBodySchema,
    adminGameSchema,
    adminServerCreateSchema,
    adminServerSchema,
    adminServerUpdateSchema,
    errorGameInUseSchema,
    errorGameNotFoundSchema,
    errorServerNotFoundSchema,
    errorServerRunningSchema,
    errorServiceTakenSchema,
    errorUserNotFoundSchema,
    gameIdSchema,
    serverPublicIdSchema,
} from "../types/index.js";

const c = initContract();

const gameIdParamsSchema = z.object({
    gameId: z.coerce.number().pipe(gameIdSchema),
});

const serverParamsSchema = z.object({
    serverPublicId: serverPublicIdSchema,
});

/** For the app admins: the games and the servers rows of the database */
export default c.router({
    listGames: {
        method: "GET",
        path: "/admin/games",
        description: "Get the games, with how many servers use each",
        responses: {
            200: apiSuccess(
                z.object({
                    games: z.array(adminGameSchema),
                })
            ),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
    createGame: {
        method: "POST",
        path: "/admin/games",
        description: "Add a game",
        body: adminGameBodySchema,
        responses: {
            200: apiSuccess(adminGameSchema),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
    updateGame: {
        method: "PUT",
        path: "/admin/games/:gameId",
        description:
            "Rename a game or change its service prefix. The prefix only while no server uses the game: it's in their folder and unit",
        pathParams: gameIdParamsSchema,
        body: adminGameBodySchema,
        responses: {
            200: apiSuccess(adminGameSchema),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorGameNotFoundSchema,
            409: errorGameInUseSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
    deleteGame: {
        method: "DELETE",
        path: "/admin/games/:gameId",
        description: "Delete a game no server uses",
        pathParams: gameIdParamsSchema,
        body: z.undefined(),
        responses: {
            200: apiSuccess(z.object({ id: gameIdSchema })),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorGameNotFoundSchema,
            409: errorGameInUseSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    listServers: {
        method: "GET",
        path: "/admin/servers",
        description: "Get every server row",
        responses: {
            200: apiSuccess(
                z.object({
                    servers: z.array(adminServerSchema),
                })
            ),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
    createServer: {
        method: "POST",
        path: "/admin/servers",
        description:
            "Add a server row. Its files, unit or container must already exist on the host",
        body: adminServerCreateSchema,
        responses: {
            200: apiSuccess(adminServerSchema),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: z.union([errorGameNotFoundSchema, errorUserNotFoundSchema]),
            409: errorServiceTakenSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
    updateServer: {
        method: "PUT",
        path: "/admin/servers/:serverPublicId",
        description:
            "Change a server row. The runtime, and the archived and updating statuses, need the server stopped",
        pathParams: serverParamsSchema,
        body: adminServerUpdateSchema,
        responses: {
            200: apiSuccess(adminServerSchema),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: z.union([errorServerNotFoundSchema, errorUserNotFoundSchema]),
            409: errorServerRunningSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
    deleteServer: {
        method: "DELETE",
        path: "/admin/servers/:serverPublicId",
        description:
            "Delete a stopped server's row and its permissions. Its files, unit or container stay on the host: adding it again finds them",
        pathParams: serverParamsSchema,
        body: z.undefined(),
        responses: {
            200: apiSuccess(z.object({ publicId: serverPublicIdSchema })),
            400: ZodErrorSchema,
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: errorServerNotFoundSchema,
            409: errorServerRunningSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
});
