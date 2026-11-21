import { describe, it, expect } from "vitest";
import {
    adminServerCreateSchema,
    adminServerUpdateSchema,
    serviceNameSchema,
} from "../../src/types/index.js";
import contract from "../../src/contract/index.js";

describe("serviceNameSchema", () => {
    it("accepts unit and folder names", () => {
        for (const name of ["mc", "survival", "beammp", "s1", "my-server"]) {
            expect(serviceNameSchema.safeParse(name).success).toBe(true);
        }
    });

    it("rejects paths, options and unit separators", () => {
        for (const name of [
            "",
            "-mc",
            "..",
            "../etc",
            "a/b",
            "mc@x",
            "Survival",
            "a b",
            "a".repeat(17),
        ]) {
            expect(serviceNameSchema.safeParse(name).success).toBe(false);
        }
    });
});

describe("game routes", () => {
    it("take the game id from the path", () => {
        const params = contract.admin.updateGame.pathParams;
        expect(params.parse({ gameId: "3" })).toEqual({ gameId: 3 });
        for (const gameId of ["0", "-1", "1.5", "abc", "70000"]) {
            expect(params.safeParse({ gameId }).success).toBe(false);
        }
    });

    it("trim the name", () => {
        expect(
            contract.admin.createGame.body.parse({
                name: "  Minecraft ",
                servicePrefix: "mc",
            })
        ).toEqual({ name: "Minecraft", servicePrefix: "mc" });
        expect(
            contract.admin.createGame.body.safeParse({
                name: " ",
                servicePrefix: "mc",
            }).success
        ).toBe(false);
    });
});

describe("adminServerCreateSchema", () => {
    const server = {
        name: "Survival",
        gameId: 1,
        service: "survival",
        ip: "mc.example.com",
        ownerPublicId: "abcd1234",
        runtime: "docker",
    };

    it("defaults to setup, without auto backup", () => {
        expect(adminServerCreateSchema.parse(server)).toEqual({
            ...server,
            status: "setup",
            autoBackup: false,
        });
    });

    it("rejects an unknown runtime", () => {
        expect(
            adminServerCreateSchema.safeParse({ ...server, runtime: "podman" })
                .success
        ).toBe(false);
    });
});

describe("adminServerUpdateSchema", () => {
    it("takes any subset", () => {
        expect(adminServerUpdateSchema.parse({})).toEqual({});
        expect(adminServerUpdateSchema.parse({ runtime: "systemd" })).toEqual({
            runtime: "systemd",
        });
    });

    it("ignores the game and the service", () => {
        expect(
            adminServerUpdateSchema.parse({
                gameId: 2,
                service: "other",
                name: "A",
            })
        ).toEqual({ name: "A" });
    });
});
