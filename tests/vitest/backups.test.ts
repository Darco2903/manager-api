import { describe, it, expect } from "vitest";
import { backupNameSchema } from "../../src/types/index.js";

describe("backupNameSchema", () => {
    it("accepts a UTC time and a reason", () => {
        for (const name of [
            "2026-11-10_21-05-00_manual",
            "2026-11-10_21-05-00_stop",
            "2026-11-10_21-05-00_restore",
        ]) {
            expect(backupNameSchema.safeParse(name).success).toBe(true);
        }
    });

    it("rejects paths, extensions and unknown reasons", () => {
        for (const name of [
            "",
            "2026-11-10_21-05-00",
            "2026-11-10_21-05-00_manual.tar.gz",
            "2026-11-10_21-05-00_other",
            "../2026-11-10_21-05-00_manual",
            "2026-11-10_21-05-00_manual/x",
            "2026-11-10 21:05:00_manual",
            "auto",
        ]) {
            expect(backupNameSchema.safeParse(name).success).toBe(false);
        }
    });
});
