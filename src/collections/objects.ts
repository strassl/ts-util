export function entries(obj: Record<string | number, unknown>): [string | number, unknown][] {
  return Object.keys(obj).map((key) => {
    const entry: [string | number, unknown] = [key, obj[key]];
    return entry;
  });
}

export function isObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null;
}

export function flattenObject(obj: Record<string | number, unknown>): { path: string; value: unknown }[] {
  const results: { path: string; value: unknown }[] = [];
  for (const [k, v] of entries(obj)) {
    if (isObject(v)) {
      const subResults = flattenObject(v as Record<string | number, unknown>).map(({ path, value }) => ({
        path: `${k}.${path}`,
        value: value,
      }));
      results.push(...subResults);
    } else {
      results.push({ path: `${k}`, value: v });
    }
  }
  return results;
}
