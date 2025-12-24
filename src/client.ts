export * from "./common.js";
import io from "socket.io-client";
import { initClient } from "@ts-rest/core";
import contract from "./contract/index.js";
import type { ManagerClientSocket } from "./socket/index.js";

export function createClient(origin: string) {
    return initClient(contract, {
        baseUrl: origin,
        credentials: "include",
    });
}

export function createSocket(origin: string): ManagerClientSocket {
    return io(origin, {
        autoConnect: true,
    });
}
