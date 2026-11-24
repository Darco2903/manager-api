import { describe, it, expect } from "vitest";
import {
    serverConfigKeySchema,
    serverConfigValueSchema,
    serverConfigSchema,
} from "../../src/types/index.js";
import contract from "../../src/contract/index.js";

describe("serverConfigKeySchema", () => {
    it("accepts the keys of server.properties", () => {
        for (const key of [
            "motd",
            "server-port",
            "rcon.port",
            "max-players",
            "level_type",
            "management-server-enabled",
        ]) {
            expect(serverConfigKeySchema.safeParse(key).success).toBe(true);
        }
    });

    it("rejects what would break the line", () => {
        for (const key of [
            "",
            "a=b",
            "a:b",
            "a b",
            "#motd",
            "!motd",
            "a\nb",
            "a\\b",
            "x".repeat(129),
        ]) {
            expect(serverConfigKeySchema.safeParse(key).success).toBe(false);
        }
    });
});

describe("serverConfigValueSchema", () => {
    it("accepts any text, a line break and escapes included", () => {
        for (const value of [
            "",
            "A Minecraft Server",
            "\u00a7aGreen \u00e9t\u00e9",
            "line 1\nline 2",
            "C:\\path=x:y #!",
        ]) {
            expect(serverConfigValueSchema.safeParse(value).success).toBe(true);
        }
    });

    it("rejects the other control characters", () => {
        for (const value of [
            "a\rb",
            "a\0b",
            "a\tb",
            "a\x7fb",
            "x".repeat(1025),
        ]) {
            expect(serverConfigValueSchema.safeParse(value).success).toBe(
                false
            );
        }
    });
});

describe("config contract", () => {
    it("has no updated_at before the first start", () => {
        expect(
            serverConfigSchema.safeParse({
                file: "server.properties",
                values: {},
                locked: { "server-port": "25580" },
                adminOnly: ["online-mode"],
                updated_at: null,
            }).success
        ).toBe(true);
    });

    it("needs updated_at to save, null to create", () => {
        const body = contract.config.write.body;
        expect(
            body.safeParse({ values: { motd: "x" }, updated_at: null }).success
        ).toBe(true);
        expect(
            body.safeParse({
                values: { "max-players": "10" },
                updated_at: "2026-11-25T12:00:00.000Z",
            }).success
        ).toBe(true);
        expect(body.safeParse({ values: { motd: "x" } }).success).toBe(false);
        expect(
            body.safeParse({ values: { "a=b": "x" }, updated_at: null }).success
        ).toBe(false);
        expect(
            body.safeParse({ values: { motd: "a\rb" }, updated_at: null })
                .success
        ).toBe(false);
    });
});
