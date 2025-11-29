import type { ActiveState } from "../common.js";

export interface SocketClientToServerServer {
    //
}

export interface SocketServerToClientServer {
    serverStatus: (serverId: string, status: ActiveState) => void;
}
