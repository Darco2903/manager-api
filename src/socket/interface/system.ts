import type { SystemInfo } from "../../types/index.js";

export interface SocketClientToServerSystem {
    systemInfoSubscribe: (callback: (success: true) => void) => void;
    systemInfoUnsubscribe: (callback: (success: true) => void) => void;
}

export interface SocketServerToClientSystem {
    systemInfo: (status: SystemInfo) => void;
}
