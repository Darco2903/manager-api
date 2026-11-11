import z from "zod";
import { serverPublicIdSchema } from "./global.js";
import { activeStateSchema } from "./systemd.js";

/** skipped: not used (no server on that runtime...) or not now (the server is stopped) */
export const featureCheckStateSchema = z.enum(["ok", "warning", "error", "skipped"]);

export type FeatureCheckState = z.infer<typeof featureCheckStateSchema>;

export const featureCheckSchema = z.object({
    state: featureCheckStateSchema,
    /** What went wrong, the message of the system, untranslated. null when ok or skipped */
    detail: z.string().nullable(),
});

export type FeatureCheck = z.infer<typeof featureCheckSchema>;

/** What the whole manager needs */
export const appChecksSchema = z.object({
    database: featureCheckSchema,
    /** Its public key, to verify the logins */
    auth: featureCheckSchema,
    /** systemctl over D-Bus, for the servers on systemd */
    systemd: featureCheckSchema,
    /** The docker-proxy, for the servers on Docker */
    docker: featureCheckSchema,
    logsFolder: featureCheckSchema,
    runFolder: featureCheckSchema,
    filesFolder: featureCheckSchema,
    backupsFolder: featureCheckSchema,
});

export type AppChecks = z.infer<typeof appChecksSchema>;

/** What each server needs, every feature of its pages */
export const serverChecksSchema = z.object({
    /** Its systemd units, or its container */
    found: featureCheckSchema,
    status: featureCheckSchema,
    /** The file manager: its folder read, and written */
    files: featureCheckSchema,
    /** Listed, and the newest one read */
    logs: featureCheckSchema,
    /** Its FIFO for the commands, last.log for the output. While it runs */
    console: featureCheckSchema,
    /** Its start file. While it runs */
    uptime: featureCheckSchema,
    backups: featureCheckSchema,
});

export type ServerChecks = z.infer<typeof serverChecksSchema>;

export const serverChecksEntrySchema = z.object({
    serverPublicId: serverPublicIdSchema,
    name: z.string(),
    /** prefix@name */
    service: z.string(),
    runtime: z.enum(["systemd", "docker"]),
    /** unknown when its runtime doesn't answer */
    activeState: activeStateSchema,
    checks: serverChecksSchema,
});

export type ServerChecksEntry = z.infer<typeof serverChecksEntrySchema>;

export const checksReportSchema = z.object({
    checked_at: z.string().datetime(),
    app: appChecksSchema,
    servers: z.array(serverChecksEntrySchema),
});

export type ChecksReport = z.infer<typeof checksReportSchema>;
