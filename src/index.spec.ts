import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as lockfile from "@yarnpkg/lockfile";

function runScript(...args: string[]) {
  return spawnSync(
    "node",
    ["--strip-types", path.resolve(import.meta.dirname, "index.ts"), ...args],
    { encoding: "utf8" }
  );
}

function writeLockfile(
  filePath: string,
  obj: Record<string, { version: string }>
) {
  fs.writeFileSync(filePath, lockfile.stringify(obj), "utf8");
}

describe("index.ts CLI", () => {
  let tmpDir: string;
  let lockfilePath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "yarn-v1-lock-snip-test-"));
    lockfilePath = path.join(tmpDir, "yarn.lock");
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("exits with code 1 when no arguments are provided", () => {
    const result = runScript();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Usage:");
  });

  it("exits with code 1 when only the lockfile path is provided", () => {
    const result = runScript(lockfilePath);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Usage:");
  });

  it("removes the specified package from the lockfile and writes it back", () => {
    const input = {
      "lodash@^4.17.21": { version: "4.17.21" },
      "react@^18.0.0": { version: "18.0.0" },
    };
    writeLockfile(lockfilePath, input);

    const result = runScript(lockfilePath, "lodash");

    expect(result.status).toBe(0);
    const output = lockfile.parse(fs.readFileSync(lockfilePath, "utf8"));
    expect(output.object).toEqual({ "react@^18.0.0": { version: "18.0.0" } });
  });

  it("leaves the lockfile unchanged when the package is not present", () => {
    const input = { "lodash@^4.17.21": { version: "4.17.21" } };
    writeLockfile(lockfilePath, input);

    const result = runScript(lockfilePath, "react");

    expect(result.status).toBe(0);
    const output = lockfile.parse(fs.readFileSync(lockfilePath, "utf8"));
    expect(output.object).toEqual(input);
  });

  it("removes all version entries for the specified package", () => {
    const input = {
      "has-symbols@^1.0.3": { version: "1.0.3" },
      "has-symbols@^1.1.0": { version: "1.1.0" },
      "has-tostringtag@^1.0.0": { version: "1.0.0" },
    };
    writeLockfile(lockfilePath, input);

    const result = runScript(lockfilePath, "has-symbols");

    expect(result.status).toBe(0);
    const output = lockfile.parse(fs.readFileSync(lockfilePath, "utf8"));
    expect(output.object).toEqual({
      "has-tostringtag@^1.0.0": { version: "1.0.0" },
    });
  });
});
