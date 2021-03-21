import { entries, isObject, flattenObject } from './objects';

test('entries should return alle key value pairs from object', () => {
  const obj = {
    a: 1,
    b: null,
    c: undefined,
    7: 8,
    d: {
      e: 'f',
    },
  };

  expect(entries(obj)).toMatchInlineSnapshot(`
    Array [
      Array [
        "7",
        8,
      ],
      Array [
        "a",
        1,
      ],
      Array [
        "b",
        null,
      ],
      Array [
        "c",
        undefined,
      ],
      Array [
        "d",
        Object {
          "e": "f",
        },
      ],
    ]
  `);
});

test('isObject should return false for non-objects', () => {
  expect(isObject(null)).toBe(false);
  expect(isObject(undefined)).toBe(false);
  expect(isObject(true)).toBe(false);
  expect(isObject(1)).toBe(false);
  expect(isObject('abc')).toBe(false);
  expect(isObject(() => 1)).toBe(false);
});

test('isObject should return true for objects', () => {
  expect(isObject({})).toBe(true);
  expect(isObject(new String('a'))).toBe(true);
  expect(isObject(new Number(1))).toBe(true);
  expect(isObject([])).toBe(true);
});

test('flattenObject should return array containing all nested key/value pairs', () => {
  const obj = {
    a: 1,
    b: null,
    c: undefined,
    7: 8,
    d: {
      e: 'f',
      g: {
        h: 1,
        i: 2,
      },
    },
    9: {
      10: 11,
    },
    g: [],
  };

  expect(flattenObject(obj)).toMatchInlineSnapshot(`
    Array [
      Object {
        "path": "7",
        "value": 8,
      },
      Object {
        "path": "9.10",
        "value": 11,
      },
      Object {
        "path": "a",
        "value": 1,
      },
      Object {
        "path": "b",
        "value": null,
      },
      Object {
        "path": "c",
        "value": undefined,
      },
      Object {
        "path": "d.e",
        "value": "f",
      },
      Object {
        "path": "d.g.h",
        "value": 1,
      },
      Object {
        "path": "d.g.i",
        "value": 2,
      },
    ]
  `);
});
