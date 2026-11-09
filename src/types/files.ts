import z from "zod";
import { apiError } from "../types.js";

/**
 * A path in the server folder, relative to it: "/" separated, "" for the folder itself. No ".", ".."
 * or empty segment, no backslash or control character.
 */
export const serverFilePathSchema = z
    .string()
    .max(4096)
    .refine(
        (path) =>
            path === ""
            || path
                .split("/")
                .every(
                    (segment) =>
                        segment !== ""
                        && segment !== "."
                        && segment !== ".."
                        && segment.length <= 255
                        && !/[\\\x00-\x1f\x7f]/.test(segment)
                ),
        { message: "Invalid path" }
    );

/** other: symlinks, FIFOs, sockets... listed, but not opened */
export const serverFileTypeSchema = z.enum(["file", "directory", "other"]);

export type ServerFileType = z.infer<typeof serverFileTypeSchema>;

export const serverFileEntrySchema = z.object({
    name: z.string(),
    type: serverFileTypeSchema,
    size: z.number().int().nonnegative(),
    updated_at: z.string().datetime(),
    /** Code the game may run (.jar, .sh...): creating, writing or moving it needs SERVER_ADMIN */
    executable: z.boolean(),
});

export type ServerFileEntry = z.infer<typeof serverFileEntrySchema>;

export const serverFileEntryParsedSchema = serverFileEntrySchema.extend({
    updated_at: z.date(),
});

export type ServerFileEntryParsed = z.infer<typeof serverFileEntryParsedSchema>;

export const serverFileListSchema = z.object({
    path: serverFilePathSchema,
    entries: z.array(serverFileEntrySchema),
});

export type ServerFileList = z.infer<typeof serverFileListSchema>;

/** A text file opened in the editor */
export const serverFileContentSchema = z.object({
    content: z.string(),
    size: z.number().int().nonnegative(),
    /** Sent back when saving: the save fails if the file changed since */
    updated_at: z.string().datetime(),
});

export type ServerFileContent = z.infer<typeof serverFileContentSchema>;

export const errorFileNotFoundSchema = apiError(
    z.literal("FILE_NOT_FOUND"),
    z.literal("File not found")
);

/** Out of the server folder through a symlink, a file where a folder is expected, the folder itself... */
export const errorInvalidPathSchema = apiError(
    z.literal("INVALID_PATH"),
    z.string()
);

/** Creating, writing or moving code the game may run, without SERVER_ADMIN */
export const errorExecutableFileSchema = apiError(
    z.literal("EXECUTABLE_FILE"),
    z.literal("Executable files need SERVER_ADMIN")
);

export const errorFileExistsSchema = apiError(
    z.literal("FILE_EXISTS"),
    z.literal("File already exists")
);

/** Changed on the disk since it was opened, by the game or someone else */
export const errorFileChangedSchema = apiError(
    z.literal("FILE_CHANGED"),
    z.literal("File changed since it was opened")
);

export const errorFileTooLargeSchema = apiError(
    z.literal("FILE_TOO_LARGE"),
    z.string()
);

/** Binary or not UTF-8: download it instead */
export const errorNotTextSchema = apiError(
    z.literal("NOT_TEXT"),
    z.literal("Not a text file")
);
