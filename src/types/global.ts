import z from "zod";
import { SERVER_PUBLIC_ID_LENGTH } from "../consts.js";

export const serverPublicIdSchema = z
    .string()
    .length(SERVER_PUBLIC_ID_LENGTH)
    .regex(/^[a-zA-Z0-9]{8}$/);
