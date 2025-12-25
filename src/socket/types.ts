import type { Socket as ClientSocket } from "socket.io-client";
import {
    ManagerClientToServerEvents as ClientToServer,
    ManagerServerToClientEvents as ServerToClient,
} from "./interface/index.js";

export type ManagerClientSocket = ClientSocket<ServerToClient, ClientToServer>;
