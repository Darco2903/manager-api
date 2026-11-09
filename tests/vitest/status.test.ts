import { describe, it, expect } from "vitest";
import { serverStatusSchema } from "../../src/types/index.js";
import contract from "../../src/contract/index.js";

describe("serverStatusSchema", () => {
    it("accepts the statuses", () => {
        for (const status of [
            "ready",
            "setup",
            "maintenance",
            "updating",
            "private",
            "locked",
            "archived",
        ]) {
            expect(serverStatusSchema.safeParse(status).success).toBe(true);
        }
    });

    it("rejects the others", () => {
        for (const status of ["", "testing", "READY"]) {
            expect(serverStatusSchema.safeParse(status).success).toBe(false);
        }
    });
});

describe("setStatus", () => {
    const route = contract.servers.setStatus;

    it("takes a status in the body", () => {
        expect(route.body.parse({ status: "maintenance" })).toEqual({
            status: "maintenance",
        });
        expect(route.body.safeParse({}).success).toBe(false);
        expect(route.body.safeParse({ status: "testing" }).success).toBe(false);
    });
});

describe("blocked actions", () => {
    const error = {
        code: "SERVER_STATUS",
        error: "Server in maintenance",
        name: "APIError",
        data: { status: "maintenance" },
    };

    it("answer 409 with the status", () => {
        for (const route of [
            contract.servers.start,
            contract.servers.stop,
            contract.servers.restart,
            contract.console.command,
        ]) {
            expect(route.responses[409].safeParse(error).success).toBe(true);
        }
    });

    it("start still answers on the memory", () => {
        const memory = {
            code: "INSUFFICIENT_MEMORY",
            error: "Not enough memory",
            name: "APIError",
        };
        expect(
            contract.servers.start.responses[409].safeParse(memory).success
        ).toBe(true);
    });
});
