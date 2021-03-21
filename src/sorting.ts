export type Ord = -1 | 0 | 1;
export type Comparator<T> = (a: T, b: T) => Ord;

export function compare<T>(a: T, b: T): Ord {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

export function localeCompare(a: string, b: string): Ord {
  const r = Intl.Collator().compare(a, b);
  if (r < 0) {
    return -1;
  } else if (r > 0) {
    return 1;
  } else {
    return 0;
  }
}

export function nullLast<T>(comparator: Comparator<T>): Comparator<T | null | undefined> {
  return (a, b) => {
    if (a == null || b == null) {
      if (a == null && b != null) {
        return 1;
      } else if (a != null && b == null) {
        return -1;
      } else {
        return 0;
      }
    } else {
      return comparator(a, b);
    }
  };
}

export function chain<T>(...comparators: Comparator<T>[]): Comparator<T> {
  return (a: T, b: T) => {
    let order: Ord = 0;
    for (const comparator of comparators) {
      order = comparator(a, b);
      if (order !== 0) break;
    }
    return order;
  };
}

export function reversed<T>(comparator: Comparator<T>): Comparator<T> {
  return (a: T, b: T) => -comparator(a, b) as Ord;
}

export function by<T, P extends keyof T>(prop: P, comparator: Comparator<T[P]> = compare): Comparator<T> {
  return byKey((it) => it[prop], comparator);
}

export function byKey<T, K>(key: (t: T) => K, comparator: Comparator<K> = compare): Comparator<T> {
  return (a: T, b: T) => comparator(key(a), key(b));
}

export function sorted<T>(arr: T[], compare: Comparator<T>): T[] {
  const arrWithIdx: Array<[T, number]> = arr.map((el, index) => [el, index]);
  arrWithIdx.sort((a, b) => {
    const ord = compare(a[0], b[0]);
    // Stabilize the sort by falling back to idx if value is equal
    if (ord !== 0) {
      return ord;
    } else {
      return a[1] - b[1];
    }
  });
  return arrWithIdx.map((el) => el[0]);
}
