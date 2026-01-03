import type { STD } from "../../types/index.js";

export interface SocketClientToServerConsole {
    consoleStreamSubscribe: (
        serverPublicId: string,
        numberOfLines: number | undefined,
        callback: (success: boolean) => void
    ) => void;

    consoleStreamUnsubscribe: (
        serverPublicId: string,
        callback: (success: boolean) => void
    ) => void;

    consoleCommand: (
        serverPublicId: string,
        command: string,
        callback: (success: boolean) => void
    ) => void;

    // consoleAutocomplete: (
    //     serverPublicId: string,
    //     command: string,
    //     callback: (suggestions: string[]) => void
    // ) => void;
}

export interface SocketServerToClientConsole {
    consoleStream: (serverPublicId: string, type: STD, data: string) => void;
    consoleStreamClosed: (serverPublicId: string) => void;
}
