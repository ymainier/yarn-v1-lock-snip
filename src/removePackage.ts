import type { LockFileObject } from "@yarnpkg/lockfile";

export function removePackage(
  lockfileObject: LockFileObject,
  packageName: string
): LockFileObject {
  const prefix = packageName + "@";
  return Object.fromEntries(
    Object.entries(lockfileObject).filter(([key]) => !key.startsWith(prefix))
  );
}
