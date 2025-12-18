import type { STD } from "../common.js";

export interface SocketClientToServerConsole {
    consoleStreamInit: (
        serverPublicId: string,
        numberOfLines: number | undefined,
        callback: (success: boolean) => void
    ) => void;

    consoleStreamClose: (
        serverPublicId: string,
        callback: (success: boolean) => void
    ) => void;

    consoleCommand: (
        serverPublicId: string,
        command: string,
        callback: (success: boolean) => void
    ) => void;

    consoleAutocomplete: (
        serverPublicId: string,
        command: string,
        callback: (suggestions: string[]) => void
    ) => void;
}

export interface SocketServerToClientConsole {
    consoleStream: (serverPublicId: string, type: STD, data: string) => void;
    consoleStreamClosed: (serverPublicId: string) => void;
}
