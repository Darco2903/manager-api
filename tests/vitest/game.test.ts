import { describe, it, expect } from "vitest";
import {
    gameEventSchema,
    gamePlayerInfoSchema,
    gamePlayerSchema,
    gamePlayerActionSchema,
    gameListPlayerSchema,
    gameListsSchema,
} from "../../src/types/index.js";
import contract from "../../src/contract/index.js";

// Sent by ServerManagerAPI on Paper and Forge test servers
const EVENTS = [
    {
        type: "status",
        time: 1794964913201,
        data: {
            tps: 20.0,
            mspt: 12.68669319152832,
            playerCount: 0,
            maxPlayers: 20,
            memoryUsed: 750418432,
            memoryMax: 2147483648,
            worlds: [
                {
                    id: "minecraft:overworld",
                    loadedChunks: 2209,
                    entities: 82,
                    players: 0,
                },
                {
                    id: "minecraft:the_nether",
                    loadedChunks: 0,
                    entities: 0,
                    players: 0,
                },
                {
                    id: "minecraft:the_end",
                    loadedChunks: 0,
                    entities: 0,
                    players: 0,
                },
            ],
        },
    },
    {
        type: "player_join",
        time: 1794964916228,
        data: {
            name: "TestBot",
            uuid: "30fecbe1-2271-3418-8553-d3ded0e95f56",
        },
    },
    {
        type: "chat",
        time: 1794964918339,
        data: {
            name: "TestBot",
            uuid: "30fecbe1-2271-3418-8553-d3ded0e95f56",
            message: "hello from bot",
        },
    },
    {
        type: "death",
        time: 1794964925823,
        data: {
            name: "TestBot",
            uuid: "30fecbe1-2271-3418-8553-d3ded0e95f56",
            message: "TestBot died",
        },
    },
    {
        type: "player_leave",
        time: 1794964930886,
        data: {
            name: "TestBot",
            uuid: "30fecbe1-2271-3418-8553-d3ded0e95f56",
        },
    },
    {
        type: "server_stopping",
        time: 1794964933933,
        data: null,
    },
    {
        type: "advancement",
        time: 1794964123215,
        data: {
            name: "TestBot",
            uuid: "30fecbe1-2271-3418-8553-d3ded0e95f56",
            advancement: "minecraft:story/mine_stone",
        },
    },
];

// A player from Paper, with some items
const PLAYER = {
    uuid: "30fecbe1-2271-3418-8553-d3ded0e95f56",
    name: "TestBot",
    ping: 1,
    op: false,
    gamemode: "creative",
    world: "minecraft:overworld",
    pos: {
        x: 3.5,
        y: -60.0,
        z: 5.5,
    },
    yaw: 0.0,
    pitch: 0.0,
    health: 20.0,
    maxHealth: 20.0,
    food: 20,
    saturation: 5.0,
    armor: 0,
    xpLevel: 0,
    xpProgress: 0.0,
    lastDeath: {
        world: "minecraft:overworld",
        pos: {
            x: 0.0,
            y: -60.0,
            z: 0.0,
        },
    },
    inventory: {
        main: [
            {
                id: "minecraft:diamond_sword",
                count: 1,
            },
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            {
                id: "minecraft:cobblestone",
                count: 64,
            },
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        ],
        head: {
            id: "minecraft:iron_helmet",
            count: 1,
        },
        chest: null,
        legs: null,
        feet: null,
        offhand: null,
    },
};

describe("gameEventSchema", () => {
    it("parses every event of the mod/plugin", () => {
        for (const event of EVENTS) {
            expect(gameEventSchema.parse(event)).toEqual(event);
        }
        expect(EVENTS.map((e) => e.type).sort()).toEqual([
            "advancement",
            "chat",
            "death",
            "player_join",
            "player_leave",
            "server_stopping",
            "status",
        ]);
    });

    it("rejects unknown events", () => {
        expect(
            gameEventSchema.safeParse({ type: "nope", time: 0, data: null })
                .success
        ).toBe(false);
    });
});

describe("gamePlayerInfoSchema", () => {
    it("parses a player of the mod/plugin", () => {
        expect(gamePlayerInfoSchema.parse(PLAYER)).toEqual(PLAYER);
        expect(
            gamePlayerInfoSchema.parse({ ...PLAYER, lastDeath: null }).lastDeath
        ).toBeNull();
    });
});

describe("gamePlayerSchema", () => {
    it("accepts names and UUIDs", () => {
        for (const player of [
            "Steve",
            "a_b",
            ".BedrockPlayer",
            "30fecbe1-2271-3418-8553-d3ded0e95f56",
        ]) {
            expect(gamePlayerSchema.safeParse(player).success).toBe(true);
        }
    });

    it("rejects selectors and paths", () => {
        for (const player of ["", "@a", "../x", "a b", "a".repeat(37)]) {
            expect(gamePlayerSchema.safeParse(player).success).toBe(false);
        }
    });
});

describe("playerAction", () => {
    const route = contract.game.playerAction;

    it("takes an action in the body", () => {
        expect(route.body.parse({ action: "kick" })).toEqual({
            action: "kick",
        });
        expect(
            route.body.parse({ action: "gamemode", gamemode: "creative" })
        ).toEqual({ action: "gamemode", gamemode: "creative" });
        expect(
            route.body.parse({ action: "message", message: "  hi  " })
        ).toEqual({ action: "message", message: "hi" });
    });

    it("rejects invalid actions", () => {
        for (const body of [
            {},
            { action: "op" },
            { action: "gamemode", gamemode: "flying" },
            { action: "message", message: "   " },
            { action: "message", message: "x".repeat(257) },
        ]) {
            expect(gamePlayerActionSchema.safeParse(body).success).toBe(false);
        }
    });
});

describe("gameListsSchema", () => {
    it("parses the lists of the mod/plugin", () => {
        // From Paper 26.3: a ban without reason has none
        const lists = {
            whitelist: { enabled: true, players: [".Bedrock_1", "Alex"] },
            bans: [
                {
                    name: "Griefer",
                    reason: "griefing the spawn",
                    source: "Server",
                    created: 1794982301138,
                    expires: null,
                },
                {
                    name: "Quiet",
                    reason: null,
                    source: "Server",
                    created: 1794982301240,
                    expires: null,
                },
            ],
            ops: ["Alex"],
        };
        expect(gameListsSchema.parse(lists)).toEqual(lists);
        expect(
            gameListsSchema.parse({ whitelist: null, bans: null, ops: null })
        ).toEqual({ whitelist: null, bans: null, ops: null });
    });
});

describe("gameListPlayerSchema", () => {
    it("accepts Java and Bedrock names", () => {
        for (const name of ["Steve", "a", "Griefer_1", ".Bedrock-Steve"]) {
            expect(gameListPlayerSchema.safeParse(name).success).toBe(true);
        }
    });

    it("rejects selectors, UUIDs and long names", () => {
        for (const name of [
            "",
            "@a",
            "Steve @a",
            "a_name_way_too_long",
            "069a79f4-44e9-4726-a5be-fca90e38aaf5",
        ]) {
            expect(gameListPlayerSchema.safeParse(name).success).toBe(false);
        }
    });
});

describe("listAdd", () => {
    const route = contract.game.listAdd;

    it("takes a list and a reason for bans", () => {
        expect(route.body.parse({})).toEqual({});
        expect(route.body.parse({ reason: "  griefing " })).toEqual({
            reason: "griefing",
        });
        expect(route.body.safeParse({ reason: "x".repeat(257) }).success).toBe(
            false
        );
        expect(route.pathParams.shape.list.safeParse("ops").success).toBe(true);
        expect(route.pathParams.shape.list.safeParse("ips").success).toBe(
            false
        );
    });
});
