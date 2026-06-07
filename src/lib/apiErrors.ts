import axios from "axios";

function stringifyApiValue(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return stringifyApiValue(record.error)
      || stringifyApiValue(record.message)
      || stringifyApiValue(record.code);
  }

  return undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return stringifyApiValue(error.response?.data)
      || stringifyApiValue(error.message)
      || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return stringifyApiValue(error) || fallback;
}
