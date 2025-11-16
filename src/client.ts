import { io, Socket } from "socket.io-client";
export * from "./common.js";
import { initClient } from "@ts-rest/core";
import contract from "./contract/index.js";
import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from "./socket/index.js";

export function createClient(origin: string) {
    return initClient(contract, {
        baseUrl: origin,
        credentials: "include",
    });
}

export function createSocket(origin: string) {
    return io(origin, {
        autoConnect: true,
    }) as Socket<ServerToClientEvents, ClientToServerEvents>;
}
