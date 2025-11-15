import z from "zod";

export const cpuInfoSchema = z.object({
    total: z.number(),
    idle: z.number(),
    used: z.number(),
});

export type CpuInfo = z.infer<typeof cpuInfoSchema>;

export const memoryInfoSchema = z.object({
    total: z.number(),
    available: z.number(),
    used: z.number(),
});

export type MemoryInfo = z.infer<typeof memoryInfoSchema>;

export const SystemInfoSchema = z.object({
    memory: memoryInfoSchema,
    cpu: cpuInfoSchema,
});

export type SystemInfo = z.infer<typeof SystemInfoSchema>;
