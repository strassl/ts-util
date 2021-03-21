export function safeParseInt(str: string | null | undefined): number | undefined {
  if (str == null) {
    return undefined;
  }

  const num = parseInt(str, undefined);
  if (isNaN(num)) {
    return undefined;
  } else {
    return num;
  }
}

export function safeParseNumber(str: string | null | undefined): number | undefined {
  if (str == null) {
    return undefined;
  }

  const num = Number(str);
  if (isNaN(num)) {
    return undefined;
  } else {
    return num;
  }
}

export function parseIntOrThrow(str: string | null | undefined): number {
  const result = safeParseInt(str);
  if (result === undefined) {
    throw Error(`Could not parse integer from ${str}`);
  }
  return result;
}

export function parseNumberOrThrow(str: string | null | undefined): number {
  const result = safeParseNumber(str);
  if (result === undefined) {
    throw Error(`Could not parse number from ${str}`);
  }
  return result;
}
