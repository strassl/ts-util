export function mapNull<A, B>(value: A | null | undefined, f: (val: A) => B): B | null | undefined {
  if (value === undefined) {
    return undefined;
  } else if (value == null) {
    return null;
  } else {
    return f(value);
  }
}

export function mapUndefined<A, B>(value: A | undefined, f: (val: A) => B): B | undefined {
  if (value === undefined) {
    return undefined;
  } else {
    return f(value);
  }
}

export function wrapNullSafe<IN, OUT>(f: ((val: IN) => OUT) | null | undefined): (val: IN) => OUT | undefined {
  return (val: IN) => (f != null ? f(val) : undefined);
}
