import z from "zod";

export const activeStateSchema = z.enum([
    "active",
    "reloading",
    "inactive",
    "failed",
    "activating",
    "deactivating",
    "unknown",
]);

export type ActiveState = z.infer<typeof activeStateSchema>;

export const subStateSchema = z.enum([
    "dead",
    "condition",
    "start-pre",
    "start",
    "start-post",
    "running",
    "exited",
    "reload",
    "stop",
    "stop-sigterm",
    "stop-sigkill",
    "stop-post",
    "failed",
    "auto-restart",
    "listening",
    "elapsed",
    "unknown",
]);

export type SubState = z.infer<typeof subStateSchema>;

export const systemdStatusSchema = z.object({
    activeState: activeStateSchema,
    subState: subStateSchema,
});

export type SystemdStatus = z.infer<typeof systemdStatusSchema>;
