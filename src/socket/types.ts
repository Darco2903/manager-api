import {
    SocketClientToServerConsole,
    SocketServerToClientConsole,
} from "./console.js";

export interface ClientToServerEvents
    //
    extends SocketClientToServerConsole {}

export interface ServerToClientEvents
    //
    extends SocketServerToClientConsole {}
