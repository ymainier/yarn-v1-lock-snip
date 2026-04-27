import { describe, expect, it } from "vitest";
import { removePackage } from "./removePackage.js";

describe("removePackage", () => {
  it("removes all entries whose key starts with the given package name followed by @", () => {
    const input = {
      "has-symbols@^1.0.3": { version: "1.0.3" },
      "has-symbols@^1.1.0": { version: "1.1.0" },
      "has-tostringtag@^1.0.0": { version: "1.0.0" },
    };
    expect(removePackage(input, "has-symbols")).toEqual({
      "has-tostringtag@^1.0.0": { version: "1.0.0" },
    });
  });

  it("removes scoped packages (package name starting with @)", () => {
    const input = {
      "@yarnpkg/lockfile@~1.0.3": { version: "1.0.3" },
      "@yarnpkg/core@^4.0.0": { version: "4.0.0" },
    };
    expect(removePackage(input, "@yarnpkg/lockfile")).toEqual({
      "@yarnpkg/core@^4.0.0": { version: "4.0.0" },
    });
  });

  it("returns an empty object when all entries match", () => {
    const input = { "lodash@^4.17.21": { version: "4.17.21" } };
    expect(removePackage(input, "lodash")).toEqual({});
  });

  it("returns entries unchanged when package name does not match anything", () => {
    const input = { "lodash@^4.17.21": { version: "4.17.21" } };
    expect(removePackage(input, "react")).toEqual({
      "lodash@^4.17.21": { version: "4.17.21" },
    });
  });

  it("does not mutate the input object", () => {
    const input = {
      "foo@^1.0.0": { version: "1.0.0" },
      "bar@^2.0.0": { version: "2.0.0" },
    };
    const inputCopy = { ...input };
    removePackage(input, "foo");
    expect(input).toEqual(inputCopy);
  });

  it("does not remove entries that merely start with the package name without @", () => {
    const input = {
      "has-symbols@^1.0.3": { version: "1.0.3" },
      "has-symbols-extra@^1.0.0": { version: "1.0.0" },
    };
    expect(removePackage(input, "has-symbols")).toEqual({
      "has-symbols-extra@^1.0.0": { version: "1.0.0" },
    });
  });
});
