import {
    SocketClientToServerConsole,
    SocketServerToClientConsole,
} from "./console.js";
import {
    SocketClientToServerServer,
    SocketServerToClientServer,
} from "./server.js";

export interface ClientToServerEvents
    //
    extends SocketClientToServerConsole,
        SocketClientToServerServer {}

export interface ServerToClientEvents
    //
    extends SocketServerToClientConsole,
        SocketServerToClientServer {}
