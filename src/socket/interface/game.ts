import type { GameEvent } from "../../types/index.js";

/** The live events of the game, for the viewers with SERVER_METRICS */
export interface SocketClientToServerGame {
    gameSubscribe: (
        serverPublicId: string,
        callback: (success: boolean) => void
    ) => void;

    gameUnsubscribe: (
        serverPublicId: string,
        callback: (success: boolean) => void
    ) => void;
}

export interface SocketServerToClientGame {
    gameEvent: (serverPublicId: string, event: GameEvent) => void;
    /** Whether the manager receives the events: false while the game is stopped or unreachable */
    gameConnected: (serverPublicId: string, connected: boolean) => void;
}
