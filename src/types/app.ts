import z from "zod";
import { systemInfoSchema } from "./system.js";

export const appOverviewSchema = systemInfoSchema.extend({
    servers: z.object({
        total: z.number().int().nonnegative(),
        online: z.number().int().nonnegative(),
        offline: z.number().int().nonnegative(),
    }),
});

export type AppOverview = z.infer<typeof appOverviewSchema>;
