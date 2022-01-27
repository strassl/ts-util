import { useRef, useEffect, useState, useCallback } from 'react';
import toPairs from 'lodash/toPairs';
import join from 'lodash/join';
import every from 'lodash/every';
import isEqual from 'lodash/isEqual';
import some from 'lodash/some';
import { assertionFailure, notNull } from './types';

export function cls(...rules: ({ [key: string]: boolean } | string | null | undefined)[]): string {
  let classes: string[] = [];
  for (const rule of rules) {
    if (rule == null) {
      continue;
    } else if (typeof rule === 'string') {
      classes.push(rule);
    } else {
      const active = toPairs(rule)
        .filter(([_, active]) => active)
        .map(([className, _]) => className);
      classes = classes.concat(active);
    }
  }

  return join(classes, ' ');
}

export function useTraceUpdate(props: any): void {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps: { [key: string]: [unknown, unknown] } = {};
    for (const [k, v] of Object.entries(props)) {
      if (prev.current[k] !== v) {
        changedProps[k] = [prev.current[k], v];
      }
    }

    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props', changedProps);
    }
    prev.current = props;
  });
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useDeepEqMemo<T>(value: T): T {
  const ref = useRef<T>();
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current ?? value;
}

export type DepsList = unknown[] | [unknown];

type UnionArrayFromDepsList<T extends DepsList> = Array<T[number]>;

export type DepsChanges<D extends DepsList> = {
  previous: D | undefined;
  current: D;
  idxToChanged: Map<number, boolean>;
};

export function getDepsChanged<D extends DepsList>(previous: D | undefined, current: D): Map<number, boolean> {
  const idxToChanged = new Map<number, boolean>();
  for (let i = 0; i < current.length; i++) {
    const changed = previous === undefined || previous[i] !== current[i];
    idxToChanged.set(i, changed);
  }
  return idxToChanged;
}

function getIndices<T>(superArr: T[], subArr: T[]): number[] {
  const indices = [];
  for (const x of subArr) {
    const idx = superArr.indexOf(x);
    if (idx < 0) {
      assertionFailure('Could not find element from subarray in superarray');
    }
    indices.push(idx);
  }
  return indices;
}

function _haveAllOfDepsChanged(changes: Map<number, boolean>, indices: ReadonlyArray<number>): boolean {
  return every(indices.map((idx) => notNull(changes.get(idx))));
}

export function haveAllOfDepsChanged<D extends DepsList, SD extends UnionArrayFromDepsList<D>>(
  changes: DepsChanges<D>,
  deps: SD,
): boolean {
  return _haveAllOfDepsChanged(changes.idxToChanged, getIndices(changes.current, deps));
}

function _haveAnyOfDepsChanged(changes: Map<number, boolean>, indices: ReadonlyArray<number>): boolean {
  return some(indices.map((idx) => notNull(changes.get(idx))));
}

export function haveAnyOfDepsChanged<D extends DepsList, SD extends UnionArrayFromDepsList<D>>(
  changes: DepsChanges<D>,
  deps: SD,
): boolean {
  return _haveAnyOfDepsChanged(changes.idxToChanged, getIndices(changes.current, deps));
}

export function haveAnyDepsChanged<D extends DepsList>(changes: DepsChanges<D>): boolean {
  return _haveAnyOfDepsChanged(
    changes.idxToChanged,
    changes.current.map((_it, idx) => idx),
  );
}

function _haveOnlyDepsChanged(changes: Map<number, boolean>, indices: ReadonlyArray<number>): boolean {
  const indexSet = new Set(indices);
  const changesOk = Array.from(changes.entries()).map(([idx, hasChanged]) => {
    const shouldHaveChanged = indexSet.has(idx);
    const changeOk = shouldHaveChanged === hasChanged;
    return changeOk;
  });

  return every(changesOk);
}

export function haveOnlyDepsChanged<D extends DepsList, SD extends UnionArrayFromDepsList<D>>(
  changes: DepsChanges<D>,
  deps: SD,
): boolean {
  return _haveOnlyDepsChanged(changes.idxToChanged, getIndices(changes.current, deps));
}

export function useMemoSemantic<T, D extends DepsList>(
  factory: (changes: DepsChanges<D>, previousValue: T | undefined) => T,
  deps: D,
): T {
  const [current, setCurrent] = useState(
    factory({ previous: undefined, current: deps, idxToChanged: getDepsChanged(undefined, deps) }, undefined),
  );
  const previousDepsRef = useRef<D>();
  const previousValue = usePrevious(current);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const prevDeps = previousDepsRef.current;

    const depsChanged = getDepsChanged(prevDeps, deps);
    const shouldUpdate = some(Object.values(depsChanged));

    if (shouldUpdate) {
      const value = factory({ previous: prevDeps, current: deps, idxToChanged: depsChanged }, previousValue);
      setCurrent(value);
    }
    previousDepsRef.current = deps;
  });

  return current;
}

export function useConditionalEffect<D extends DepsList>(
  effect: (changes: DepsChanges<D>) => void | (() => void | undefined),
  deps: D,
  shouldUpdate: (changes: DepsChanges<D>) => boolean = (changes) => haveAnyDepsChanged(changes),
): void {
  const previousDepsRef = useRef<D>();
  const cleanupRef = useRef<() => void>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const prevDeps = previousDepsRef.current;

    const changes: DepsChanges<D> = { previous: prevDeps, current: deps, idxToChanged: getDepsChanged(prevDeps, deps) };

    if (shouldUpdate(changes)) {
      const currentCleanup = cleanupRef.current;
      if (currentCleanup !== undefined) {
        currentCleanup();
      }
      const cleanup = effect(changes);
      if (typeof cleanup === 'function') {
        cleanupRef.current = cleanup;
      } else {
        cleanupRef.current = undefined;
      }
    }
    previousDepsRef.current = deps;
  });
}

export function useCallbackRef<S, T extends NonNullable<S>>(
  callback: (value: T) => () => void | undefined,
): { ref: React.RefObject<{ value: T } | undefined>; callback: (value: T) => void } {
  // Holds the destructor function returned by the callback
  const destructorRef = useRef<() => void>();
  const elementRef = useRef<{ value: T }>();

  // Create a callback wrapper that stores the destructor function and executes it on the next callback
  const wrappedCallback = useCallback(
    (value: T) => {
      elementRef.current = { value: value };
      if (destructorRef.current != null) {
        destructorRef.current();
        destructorRef.current = undefined;
      }
      destructorRef.current = callback(value);
    },
    [callback],
  );

  return {
    ref: elementRef,
    callback: wrappedCallback,
  };
}
