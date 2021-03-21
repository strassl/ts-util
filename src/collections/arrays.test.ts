import { intersperse, zip, single, groupByTo, associateByTo } from './arrays';

test('intersperse should intersperse array with supplied delimiter', () => {
  expect(Array.from(intersperse([1, 3, 5, 7], (i) => i - 1))).toMatchInlineSnapshot(`
    Array [
      1,
      0,
      3,
      1,
      5,
      2,
      7,
    ]
  `);
});

test('zip should zip together left and right array', () => {
  expect(zip([1, 3, 5, 7], [2, 4])).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
        2,
      ],
      Array [
        3,
        4,
      ],
    ]
  `);
});

test('single should return content of array with single element matching predicate', () => {
  expect(single([1, 2], (it) => it === 1)).toBe(1);
});

test('single should fail if no element matches predicate', () => {
  expect(() => single([1, 2], (it) => it === 0)).toThrow();
});

test('single should fail if more than one element matches predicate', () => {
  expect(() => single([1, 2], (it) => it > 0)).toThrow();
});

test('groupByTo should group array by key and transform values', () => {
  expect(
    groupByTo(
      [1, 2, 3, 4, 5, 6],
      (it) => it % 2 === 0,
      (it) => `${it}`,
    ),
  ).toMatchInlineSnapshot(`
    Map {
      false => Array [
        "1",
        "3",
        "5",
      ],
      true => Array [
        "2",
        "4",
        "6",
      ],
    }
  `);
});

test('associateByTo should associate array by key and transform values', () => {
  expect(
    associateByTo(
      ['a', 'ab', 'abc', 'abcd'],
      (it) => it.length,
      (it) => it + '!',
    ),
  ).toMatchInlineSnapshot(`
    Map {
      1 => "a!",
      2 => "ab!",
      3 => "abc!",
      4 => "abcd!",
    }
  `);
});

test('associateByTo with duplicate keys should fail', () => {
  expect(() =>
    associateByTo(
      ['a', 'ab', 'abc', 'abcd', 'a'],
      (it) => it.length,
      (it) => it + '!',
    ),
  ).toThrow();
});
