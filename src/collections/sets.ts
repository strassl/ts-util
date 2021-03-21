export function intersection<T>(left: Set<T>, right: Set<T>): Set<T> {
  const result = new Set<T>();
  left.forEach((value) => {
    if (right.has(value)) {
      result.add(value);
    }
  });
  return result;
}

export function union<T>(left: Set<T>, right: Set<T>): Set<T> {
  const result = new Set<T>();
  left.forEach((value) => {
    result.add(value);
  });
  right.forEach((value) => {
    result.add(value);
  });
  return result;
}

export function difference<T>(left: Set<T>, right: Set<T>): Set<T> {
  const result = new Set(left);
  right.forEach((value) => {
    result.delete(value);
  });
  return result;
}
