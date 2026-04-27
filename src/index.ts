#!/usr/bin/env -S node --strip-types
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import * as lockfile from "@yarnpkg/lockfile";
import { removePackage } from "./removePackage.ts";

const filePath = process.argv[2];
const packageName = process.argv[3];
if (!filePath || !packageName) {
  console.error("Usage: index.ts <lockfile> <package-name>");
  process.exit(1);
}

const file = fs.readFileSync(filePath, "utf8");
const json = lockfile.parse(file);

const result = removePackage(json.object, packageName);
const tmp = path.join(os.tmpdir(), `yarn-v1-lock-snip-${process.pid}.lock`);
fs.writeFileSync(tmp, lockfile.stringify(result), "utf8");
fs.renameSync(tmp, filePath);
