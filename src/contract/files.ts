import { initContract, ZodErrorSchema } from "@ts-rest/core";
import z from "zod";
import { apiError, apiSuccess } from "../types.js";
import { FILE_EDIT_MAX_SIZE } from "../consts.js";
import {
    errorServerNotFoundSchema,
    errorServerStatusSchema,
    serverPublicIdSchema,
    serverFilePathSchema,
    serverFileEntrySchema,
    serverFileListSchema,
    serverFileContentSchema,
    errorFileNotFoundSchema,
    errorInvalidPathSchema,
    errorExecutableFileSchema,
    errorFileExistsSchema,
    errorFileChangedSchema,
    errorFileTooLargeSchema,
    errorNotTextSchema,
} from "../types/index.js";

const c = initContract();

const pathParams = z.object({
    serverPublicId: serverPublicIdSchema,
});

const pathQuery = z.object({
    path: serverFilePathSchema.default(""),
});

/**
 * The files of the server folder, with SERVER_FILES. Its status rules apply like for the other
 * actions, and an archived server is read only. Code the game may run (`executable`) needs
 * SERVER_ADMIN to be created, written or moved.
 */
export default c.router({
    list: {
        method: "GET",
        path: "/servers/:serverPublicId/files",
        description: "List a folder of the server",
        pathParams,
        query: pathQuery,
        responses: {
            200: apiSuccess(serverFileListSchema),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: z.union([errorServerNotFoundSchema, errorFileNotFoundSchema]),
            409: errorServerStatusSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    read: {
        method: "GET",
        path: "/servers/:serverPublicId/files/content",
        description: `Read a text file, up to ${FILE_EDIT_MAX_SIZE} bytes`,
        pathParams,
        query: pathQuery,
        responses: {
            200: apiSuccess(serverFileContentSchema),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: z.union([errorServerNotFoundSchema, errorFileNotFoundSchema]),
            409: errorServerStatusSchema,
            413: errorFileTooLargeSchema,
            415: errorNotTextSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    write: {
        method: "PUT",
        path: "/servers/:serverPublicId/files/content",
        description: "Create or save a text file",
        pathParams,
        body: z.object({
            path: serverFilePathSchema,
            content: z.string().max(FILE_EDIT_MAX_SIZE),
            /** The updated_at it was read with, null to create it: the save fails if it changed since */
            updated_at: z.string().datetime().nullable(),
        }),
        responses: {
            200: apiSuccess(serverFileEntrySchema),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: z.union([
                apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
                errorExecutableFileSchema,
            ]),
            404: z.union([errorServerNotFoundSchema, errorFileNotFoundSchema]),
            409: z.union([
                errorServerStatusSchema,
                errorFileExistsSchema,
                errorFileChangedSchema,
            ]),
            413: errorFileTooLargeSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    download: {
        method: "GET",
        path: "/servers/:serverPublicId/files/download",
        description: "Download a file",
        pathParams,
        query: pathQuery,
        responses: {
            200: c.otherResponse({
                contentType: "application/octet-stream",
                body: c.type<Blob>(),
            }),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: z.union([errorServerNotFoundSchema, errorFileNotFoundSchema]),
            409: errorServerStatusSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    upload: {
        method: "POST",
        path: "/servers/:serverPublicId/files/upload",
        description: "Upload a file, its parent folder must exist",
        pathParams,
        query: z.object({
            /** Path of the new file, with its name */
            path: serverFilePathSchema,
            overwrite: z
                .enum(["true", "false"])
                .default("false")
                .transform((value) => value === "true"),
        }),
        contentType: "multipart/form-data",
        body: c.type<{ file: Blob }>(),
        responses: {
            200: apiSuccess(serverFileEntrySchema),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: z.union([
                apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
                errorExecutableFileSchema,
            ]),
            404: z.union([errorServerNotFoundSchema, errorFileNotFoundSchema]),
            409: z.union([errorServerStatusSchema, errorFileExistsSchema]),
            413: errorFileTooLargeSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    createFolder: {
        method: "POST",
        path: "/servers/:serverPublicId/files/folder",
        description: "Create a folder, its parent must exist",
        pathParams,
        body: z.object({
            path: serverFilePathSchema,
        }),
        responses: {
            200: apiSuccess(serverFileEntrySchema),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: z.union([errorServerNotFoundSchema, errorFileNotFoundSchema]),
            409: z.union([errorServerStatusSchema, errorFileExistsSchema]),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    move: {
        method: "POST",
        path: "/servers/:serverPublicId/files/move",
        description:
            "Rename or move a file or a folder. SERVER_ADMIN when the result is executable, or a folder holding executable files",
        pathParams,
        body: z.object({
            from: serverFilePathSchema,
            to: serverFilePathSchema,
        }),
        responses: {
            200: apiSuccess(serverFileEntrySchema),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: z.union([
                apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
                errorExecutableFileSchema,
            ]),
            404: z.union([errorServerNotFoundSchema, errorFileNotFoundSchema]),
            409: z.union([errorServerStatusSchema, errorFileExistsSchema]),
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },

    delete: {
        method: "DELETE",
        path: "/servers/:serverPublicId/files",
        description: "Delete a file, or a folder with its content",
        pathParams,
        query: z.object({
            path: serverFilePathSchema,
        }),
        body: z.undefined(),
        responses: {
            200: apiSuccess(z.object({})),
            400: z.union([ZodErrorSchema, errorInvalidPathSchema]),
            401: apiError(z.literal("UNAUTHORIZED"), z.literal("Unauthorized")),
            403: apiError(z.literal("FORBIDDEN"), z.literal("Forbidden")),
            404: z.union([errorServerNotFoundSchema, errorFileNotFoundSchema]),
            409: errorServerStatusSchema,
            500: apiError(z.literal("INTERNAL_SERVER_ERROR"), z.string()),
        },
    },
});
