import { assertionFailure } from '../types';

export function* intersperse<T>(array: T[], supplyDelimiter: (index: number) => T) {
  let index = 0;
  for (const x of array) {
    if (index > 0) {
      yield supplyDelimiter(index);
    }
    index++;
    yield x;
  }
}

export function zip<A, B>(left: A[], right: B[]): [A, B][] {
  const results: [A, B][] = [];
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    results.push([left[i], right[i]]);
  }
  return results;
}

export function single<T>(arr: T[], pred: (element: T) => boolean): T {
  const matches = arr.filter(pred);

  if (matches.length === 1) {
    return matches[0];
  } else if (matches.length < 1) {
    throw Error(`Single element expected but found none`);
  } else {
    throw Error(`Single element expected but found ${matches.length}`);
  }
}

export function groupByTo<T, K, V>(collection: T[], key: (val: T) => K, value: (val: T) => V): Map<K, V[]> {
  const map = new Map<K, V[]>();
  collection.map((item) => {
    const k = key(item);
    const v = value(item);
    let vals = map.get(k);
    if (vals === undefined) {
      vals = [];
    }
    vals.push(v);
    map.set(k, vals);
  });

  return map;
}

export function groupBy<T, K>(collection: T[], key: (val: T) => K): Map<K, T[]> {
  return groupByTo(collection, key, (x) => x);
}

export function associateByTo<T, K, V>(collection: T[], key: (val: T) => K, value: (val: T) => V): Map<K, V> {
  const map = new Map<K, V>();
  collection.map((item) => {
    const k = key(item);
    const v = value(item);
    if (map.get(k) !== undefined) {
      assertionFailure(`Duplicate map key "${k}"`);
    }
    map.set(k, v);
  });

  return map;
}

export function associateBy<T, K>(collection: T[], key: (val: T) => K): Map<K, T> {
  return associateByTo(collection, key, (x) => x);
}
