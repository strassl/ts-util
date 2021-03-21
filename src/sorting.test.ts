import { sorted, compare, reversed, chain, by, nullLast, byKey } from './sorting';

const numArr = [0, Number.POSITIVE_INFINITY, 9, 9, -2, 3, Number.NEGATIVE_INFINITY, 1];
const objArr = numArr.map((it, idx) => ({ val: it, idx: idx }));

test('compare should perform regular sort', () => {
  const result = sorted(numArr, compare);
  expect(result).toStrictEqual([Number.NEGATIVE_INFINITY, -2, 0, 1, 3, 9, 9, Number.POSITIVE_INFINITY]);
});

test('reversed should perform reversed sort', () => {
  const result = sorted(numArr, reversed(compare));
  expect(result).toStrictEqual(sorted(numArr, compare).reverse());
});

test('by should sort by property', () => {
  const result = sorted(objArr, by('val'));
  expect(result.map((it) => it.val)).toStrictEqual(sorted(numArr, compare));
});

test('byKey should sort by key function', () => {
  const result = sorted(
    objArr,
    byKey((it) => it.val),
  );
  expect(result.map((it) => it.val)).toStrictEqual(sorted(numArr, compare));
});

test('chain should sort lexicographically', () => {
  const result = sorted(objArr, chain(by('val'), reversed(by('idx'))));
  expect(result[5].idx).toStrictEqual(3);
  expect(result[6].idx).toStrictEqual(2);
});

test('sorted should be stable', () => {
  const result = sorted(objArr, by('val'));
  expect(result[5].idx).toStrictEqual(2);
  expect(result[6].idx).toStrictEqual(3);
});

test('nullLast should move null to end', () => {
  const result = sorted([null, 'null', '', 'foo'], nullLast(compare));
  expect(result).toStrictEqual(['', 'foo', 'null', null]);
});
