import { mapNull, mapUndefined, wrapNullSafe } from './null';

test('mapNull with null or undefined should return null or undefined', () => {
  expect(mapNull(null, (it) => `${it}`)).toBe(null);
  expect(mapNull(undefined, (it) => `${it}`)).toBe(undefined);
});

test('mapNull with value should apply function to value', () => {
  expect(mapNull(1, (it) => `${it}`)).toBe('1');
});

test('mapUndefined with undefined should return undefined', () => {
  expect(mapUndefined(undefined, (it) => `${it}`)).toBe(undefined);
});

test('mapNull with value should apply function to value', () => {
  expect(mapUndefined(null, (it) => `${it}`)).toBe('null');
  expect(mapUndefined(1, (it) => `${it}`)).toBe('1');
});

test('wrapNullSafe with null or undefined should return function that returns undefined', () => {
  expect(wrapNullSafe(null)(1)).toBe(undefined);
  expect(wrapNullSafe(undefined)(1)).toBe(undefined);
});

test('wrapNullSafe with function should return function', () => {
  expect(wrapNullSafe((it) => `${it}`)(1)).toBe('1');
});
