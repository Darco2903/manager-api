import { describe, it, expect } from "vitest";
import { checksReportSchema } from "../../src/types/index.js";
import contract from "../../src/contract/index.js";

const ok = { state: "ok", detail: null };

const report = {
    checked_at: "2026-11-11T10:00:00.000Z",
    app: {
        database: ok,
        auth: ok,
        systemd: ok,
        docker: { state: "skipped", detail: null },
        logsFolder: ok,
        runFolder: ok,
        filesFolder: ok,
        backupsFolder: { state: "error", detail: "EACCES: permission denied" },
    },
    servers: [
        {
            serverPublicId: "abcd1234",
            name: "Survival",
            service: "mc@survival",
            runtime: "systemd",
            activeState: "inactive",
            checks: {
                found: ok,
                status: ok,
                files: { state: "warning", detail: "Read only" },
                logs: ok,
                console: { state: "skipped", detail: null },
                uptime: { state: "skipped", detail: null },
                backups: ok,
            },
        },
    ],
};

describe("checksReportSchema", () => {
    it("accepts a report", () => {
        expect(checksReportSchema.safeParse(report).success).toBe(true);
    });

    it("rejects an unknown state or a missing check", () => {
        const badState = { ...report, app: { ...report.app, database: { state: "down", detail: null } } };
        expect(checksReportSchema.safeParse(badState).success).toBe(false);

        const { found, ...checks } = report.servers[0].checks;
        const missing = { ...report, servers: [{ ...report.servers[0], checks }] };
        expect(checksReportSchema.safeParse(missing).success).toBe(false);
    });
});

describe("checks contract", () => {
    it("is a GET without input", () => {
        expect(contract.checks.run.method).toBe("GET");
        expect(contract.checks.run.path).toBe("/api/v2/checks");
    });
});
