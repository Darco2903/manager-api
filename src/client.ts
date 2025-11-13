export * from "./common.js";
import { initClient } from "@ts-rest/core";
import contract from "./contract/index.js";

export function createClient(origin: string) {
    return initClient(contract, {
        baseUrl: origin,
        credentials: "include",
    });
}
