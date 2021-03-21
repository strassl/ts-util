export function sleep(ms: number): Promise<undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
}

export async function waitAtLeast<T>(promise: Promise<T>, minMs: number): Promise<T> {
  const [result] = await Promise.all<T, undefined>([promise, sleep(minMs)]);
  return result;
}
