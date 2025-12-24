import {
    SocketClientToServerConsole,
    SocketServerToClientConsole,
} from "./console.js";
import {
    SocketClientToServerServer,
    SocketServerToClientServer,
} from "./server.js";

export interface ManagerClientToServerEvents
    //
    extends SocketClientToServerConsole,
        SocketClientToServerServer {}

export interface ManagerServerToClientEvents
    //
    extends SocketServerToClientConsole,
        SocketServerToClientServer {}
