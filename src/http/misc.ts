import * as crypto from "crypto";

import {
  RequestHeaders,
  ResponseHeaders,
  RequestHeaderValue,
  ResponseHeaderValue,
} from "../models/base";

export function getHeader(
  headers: ResponseHeaders,
  name: string
): ResponseHeaderValue;

export function getHeader(
  headers: RequestHeaders,
  name: string
): RequestHeaderValue;

export function getHeader(
  headers: RequestHeaders | ResponseHeaders,
  name: string
): RequestHeaderValue | ResponseHeaderValue {
  if (!headers || !name) {
    return undefined;
  }

  const headerName = Object.keys(headers).find(
    (h) => h.toLowerCase() === name.toLowerCase()
  );
  return headerName && headers[headerName];
}

export function getContentType(
  headers: RequestHeaders | ResponseHeaders
): string | undefined {
  const value = getHeader(headers, "content-type");
  return value?.toString();
}

export function removeHeader(
  headers: RequestHeaders | ResponseHeaders,
  name: string
) {
  if (!headers || !name) {
    return;
  }

  const headerName = Object.keys(headers).find(
    (h) => h.toLowerCase() === name.toLowerCase()
  );
  if (headerName) {
    delete headers[headerName];
  }
}

export function md5(text: string | Buffer): string {
  return crypto.createHash("md5").update(text).digest("hex");
}

export function hasHeader(
  headers: RequestHeaders | ResponseHeaders,
  name: string
): boolean {
  return !!(
    headers &&
    name &&
    Object.keys(headers).some((h) => h.toLowerCase() === name.toLowerCase())
  );
}
