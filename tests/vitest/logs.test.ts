import { describe, it, expect } from "vitest";
import { serverLogNameSchema } from "../../src/types/index.js";
import contract from "../../src/contract/index.js";

describe("serverLogNameSchema", () => {
    it("accepts the log names", () => {
        for (const name of ["last.log", "2026-11-08_12:00:00.log"]) {
            expect(serverLogNameSchema.safeParse(name).success).toBe(true);
        }
    });

    it("rejects paths and hidden files", () => {
        for (const name of [
            "",
            ".",
            "..",
            "../last.log",
            "a/b.log",
            "a\\b.log",
            ".rotate_logs.sh",
            "x".repeat(256),
        ]) {
            expect(serverLogNameSchema.safeParse(name).success).toBe(false);
        }
    });
});

describe("readLog query", () => {
    const query = contract.servers.readLog.query;

    it("coerces the query strings, with a default page size", () => {
        expect(query.parse({ before: "1024" })).toEqual({
            before: 1024,
            lines: 200,
        });
        expect(query.parse({})).toEqual({ lines: 200 });
    });

    it("rejects pages out of bounds", () => {
        expect(query.safeParse({ lines: "0" }).success).toBe(false);
        expect(query.safeParse({ lines: "1001" }).success).toBe(false);
        expect(query.safeParse({ before: "-1" }).success).toBe(false);
    });
});
