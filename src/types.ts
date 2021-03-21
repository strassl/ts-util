export function assertionFailure(msg?: string): never {
  throw Error(msg !== undefined ? msg : 'Assertion failure');
}

export function notNull<T>(value: T | undefined | null): T {
  if (value == null) {
    return assertionFailure('Value was null');
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function unreachable(_x: never): never {
  return assertionFailure('Unreachable');
}

// https://github.com/microsoft/TypeScript/issues/2444
// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor<T> = Function & { prototype: T };

export function cast<T>(type: Constructor<T>, object: unknown): T {
  if (!(object instanceof type)) {
    throw new TypeError();
  }
  return <T>object;
}

export type UnPromisify<T> = T extends Promise<infer U> ? U : never;
export type UnArrayfy<T> = T extends Array<infer U> ? U : never;
