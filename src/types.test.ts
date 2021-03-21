import { assertionFailure, notNull, unreachable } from './types';

test('notNull with null or undefined should throw', () => {
  expect(() => notNull(null)).toThrow();
  expect(() => notNull(undefined)).toThrow();
});

test('notNull with value should return value', () => {
  expect(notNull('')).toBe('');
});

test('unreachable should always throw', () => {
  expect(() => unreachable('' as never)).toThrow();
});

test('assertionFailure should always throw', () => {
  expect(() => assertionFailure('msg')).toThrow();
});
