import type { ActiveState } from "../common.js";

export interface SocketClientToServerServer {
    serverInfoInit: (
        serverId: string,
        callback: (success: boolean) => void
    ) => void;

    serverInfoClose: (
        serverId: string,
        callback: (success: boolean) => void
    ) => void;
}

export interface SocketServerToClientServer {
    serverStatus: (serverId: string, status: ActiveState) => void;
}
