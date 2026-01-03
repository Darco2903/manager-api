import type { SystemInfo } from "../../types/index.js";

export interface SocketClientToServerSystem {
    systemInfoSubscribe: (callback: (success: boolean) => void) => void;
    systemInfoUnsubscribe: (callback: (success: boolean) => void) => void;
}

export interface SocketServerToClientSystem {
    systemInfo: (status: SystemInfo) => void;
}
