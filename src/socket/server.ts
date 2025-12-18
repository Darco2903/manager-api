import type { ActiveState } from "../common.js";

export interface SocketClientToServerServer {
    serverInfoInit: (
        serverPublicId: string,
        callback: (success: boolean) => void
    ) => void;

    serverInfoClose: (
        serverPublicId: string,
        callback: (success: boolean) => void
    ) => void;
}

export interface SocketServerToClientServer {
    serverStatus: (serverPublicId: string, status: ActiveState) => void;
}
