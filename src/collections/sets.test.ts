import { difference, intersection, union } from './sets';

test('intersection should return correct result', () => {
  const left = new Set([1, 2, 3, 4, 5]);
  const right = new Set([4, 2, 0]);
  const result = intersection(left, right);
  expect(result).toMatchInlineSnapshot(`
    Set {
      2,
      4,
    }
  `);
});

test('union should return correct result', () => {
  const left = new Set([1, 2, 3, 4, 5]);
  const right = new Set([4, 2, 0]);
  const result = union(left, right);
  expect(result).toMatchInlineSnapshot(`
    Set {
      1,
      2,
      3,
      4,
      5,
      0,
    }
  `);
});

test('difference should return correct result', () => {
  const left = new Set([1, 2, 3, 4, 5]);
  const right = new Set([4, 2, 0]);
  const result = difference(left, right);
  expect(result).toMatchInlineSnapshot(`
    Set {
      1,
      3,
      5,
    }
  `);
});
