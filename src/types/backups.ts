import z from "zod";
import { apiError, apiErrorData } from "../types.js";

/**
 * Why the backup was made. manual: by a user, kept up to the manual limit (a new one is refused
 * when it's full). stop and restore: automatic, after a stop or before a restore, the oldest go
 * beyond the automatic limit.
 */
export const backupReasonSchema = z.enum(["manual", "stop", "restore"]);

export type BackupReason = z.infer<typeof backupReasonSchema>;

/** Its UTC time and reason, the file name without .tar.gz: 2026-11-10_21-05-00_manual */
export const backupNameSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_(manual|stop|restore)$/);

export const backupEntrySchema = z.object({
    name: backupNameSchema,
    reason: backupReasonSchema,
    created_at: z.string().datetime(),
    size: z.number(),
});

export type BackupEntry = z.infer<typeof backupEntrySchema>;

export const backupEntryParsedSchema = backupEntrySchema.extend({
    created_at: z.date(),
});

export type BackupEntryParsed = z.infer<typeof backupEntryParsedSchema>;

/** One at a time per server, the server can't start meanwhile */
export const backupJobSchema = z.object({
    action: z.enum(["backup", "restore"]),
    backup: backupNameSchema,
    started_at: z.string().datetime(),
});

export type BackupJob = z.infer<typeof backupJobSchema>;

export const backupListSchema = z.object({
    backups: z.array(backupEntrySchema),
    job: backupJobSchema.nullable(),
    /** A backup after each stop */
    autoBackup: z.boolean(),
    limits: z.object({
        manual: z.number(),
        auto: z.number(),
    }),
});

export type BackupList = z.infer<typeof backupListSchema>;

export const errorBackupNotFoundSchema = apiError(
    z.literal("NOT_FOUND"),
    z.literal("Backup not found")
);

export const errorBackupRunningSchema = apiErrorData(
    z.literal("BACKUP_RUNNING"),
    z.string(),
    z.object({ job: backupJobSchema })
);

/** The manual backups are at their limit: delete one first */
export const errorBackupLimitSchema = apiErrorData(
    z.literal("BACKUP_LIMIT"),
    z.string(),
    z.object({ limit: z.number() })
);
