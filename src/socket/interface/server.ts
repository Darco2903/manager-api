import type { ActiveState, ServerListEntry } from "../../types/index.js";

export interface SocketClientToServerServer {
    // serverListSubscribe: (callback: (success: boolean) => void) => void;
    // serverListUnsubscribe: (callback: (success: boolean) => void) => void;

    serverInfoSubscribe: (
        serverPublicId: string,
        callback: (success: boolean) => void
    ) => void;

    serverInfoUnsubscribe: (
        serverPublicId: string,
        callback: (success: boolean) => void
    ) => void;
}

export interface SocketServerToClientServer {
    // serverList: (serverPublicIds: ServerListEntry[]) => void;
    serverStatus: (serverPublicId: string, status: ActiveState) => void;
}
