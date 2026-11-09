import { describe, it, expect } from "vitest";
import { serverFilePathSchema } from "../../src/types/index.js";
import contract from "../../src/contract/index.js";

describe("serverFilePathSchema", () => {
    it("accepts the folder itself and relative paths", () => {
        for (const path of [
            "",
            "server.properties",
            ".start.sh",
            "plugins/EssentialsX/config.yml",
            "world/region/r.0.0.mca",
            "my file (1).txt",
            "x".repeat(255),
        ]) {
            expect(serverFilePathSchema.safeParse(path).success).toBe(true);
        }
    });

    it("rejects the paths out of the folder or not normalized", () => {
        for (const path of [
            "/",
            "/etc/passwd",
            "..",
            "../x",
            "a/../../x",
            ".",
            "./x",
            "a//b",
            "a/",
            "a\\b",
            "a\0b",
            "a\nb",
            "x".repeat(256),
            "a/".repeat(2048) + "a",
        ]) {
            expect(serverFilePathSchema.safeParse(path).success).toBe(false);
        }
    });
});

describe("files contract", () => {
    it("lists the folder itself by default", () => {
        expect(contract.files.list.query.parse({})).toEqual({ path: "" });
    });

    it("parses overwrite from the query string", () => {
        const query = contract.files.upload.query;
        expect(query.parse({ path: "a.txt" })).toEqual({
            path: "a.txt",
            overwrite: false,
        });
        expect(
            query.parse({ path: "a.txt", overwrite: "true" }).overwrite
        ).toBe(true);
        expect(query.safeParse({ path: "a.txt", overwrite: "1" }).success).toBe(
            false
        );
        expect(query.safeParse({}).success).toBe(false);
    });

    it("needs updated_at to save, null to create", () => {
        const body = contract.files.write.body;
        expect(
            body.safeParse({ path: "a.txt", content: "", updated_at: null })
                .success
        ).toBe(true);
        expect(
            body.safeParse({
                path: "a.txt",
                content: "x",
                updated_at: "2026-11-10T12:00:00.000Z",
            }).success
        ).toBe(true);
        expect(body.safeParse({ path: "a.txt", content: "" }).success).toBe(
            false
        );
    });

    it("never deletes or moves the folder itself without a path", () => {
        expect(contract.files.delete.query.safeParse({}).success).toBe(false);
        expect(contract.files.move.body.safeParse({ from: "a" }).success).toBe(
            false
        );
    });
});
