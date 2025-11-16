import type { STD } from "../common.js";

export interface SocketClientToServerConsole {
    consoleStreamInit: (
        serverId: string,
        callback: (success: boolean) => void
    ) => void;
    consoleStreamClose: (
        serverId: string,
        callback: (success: boolean) => void
    ) => void;
    consoleCommand: (serverId: string, command: string) => void;
    consoleAutocomplete: (serverId: string, command: string) => void;
}

export interface SocketServerToClientConsole {
    consoleStream: (serverId: string, type: STD, data: string) => void;
    consoleStreamClosed: (serverId: string) => void;
}
