import {
    SocketClientToServerConsole,
    SocketServerToClientConsole,
} from "./console.js";
import {
    SocketClientToServerServer,
    SocketServerToClientServer,
} from "./server.js";
import {
    SocketClientToServerSystem,
    SocketServerToClientSystem,
} from "./system.js";

export interface ManagerClientToServerEvents
    //
    extends
        SocketClientToServerConsole,
        SocketClientToServerServer,
        SocketClientToServerSystem {}

export interface ManagerServerToClientEvents
    //
    extends
        SocketServerToClientConsole,
        SocketServerToClientServer,
        SocketServerToClientSystem {}
