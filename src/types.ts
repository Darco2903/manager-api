import { z, type ZodType } from "zod";

export const apiSuccess = <T>(schema: T) => schema;

export const apiError = <T, U>(code: ZodType<T>, error: ZodType<U>) =>
    z.object({
        code,
        error,
        name: z.literal("APIError"),
    });

export const apiErrorData = <T, U, V>(
    code: ZodType<T>,
    error: ZodType<U>,
    data: ZodType<V>
) =>
    z.object({
        code,
        error,
        name: z.literal("APIError"),
        data,
    });
