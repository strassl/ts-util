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

export type Nullable<T> = {
  [P in keyof T]: T[P] | null | undefined;
};

export type UnPromisify<T> = T extends Promise<infer U> ? U : never;
export type UnArrayfy<T> = T extends Array<infer U> ? U : never;

export function hasOwnProperty<X extends unknown, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
