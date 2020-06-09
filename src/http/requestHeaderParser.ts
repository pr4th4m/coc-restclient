import * as path from "path";
import * as fs from "fs-extra";
import { workspace, Uri, Document } from "coc.nvim";

import { RequestHeaders } from "../models/base";
import { removeHeader } from "./misc";

export function parseRequestHeaders(
  headerLines: string[],
  defaultHeaders: RequestHeaders,
  url: string
): RequestHeaders {
  // message-header = field-name ":" [ field-value ]
  const headers: RequestHeaders = {};
  const headerNames: { [key: string]: string } = {};
  headerLines.forEach((headerLine) => {
    let fieldName: string;
    let fieldValue: string;
    const separatorIndex = headerLine.indexOf(":");
    if (separatorIndex === -1) {
      fieldName = headerLine.trim();
      fieldValue = "";
    } else {
      fieldName = headerLine.substring(0, separatorIndex).trim();
      fieldValue = headerLine.substring(separatorIndex + 1).trim();
    }

    const normalizedFieldName = fieldName.toLowerCase();
    if (!headerNames[normalizedFieldName]) {
      headerNames[normalizedFieldName] = fieldName;
      headers[fieldName] = fieldValue;
    } else {
      const splitter = normalizedFieldName === "cookie" ? ";" : ",";
      headers[headerNames[normalizedFieldName]] += `${splitter}${fieldValue}`;
    }
  });

  if (url[0] !== "/") {
    removeHeader(defaultHeaders, "host");
  }

  return { ...defaultHeaders, ...headers };
}

export async function resolveRequestBodyPath(
  refPath: string
): Promise<string | undefined> {
  // get current document
  const document = await workspace.document;

  if (path.isAbsolute(refPath)) {
    return (await fs.pathExists(refPath)) ? refPath : undefined;
  }

  const workspaceRoot = getWorkspaceRootPath(document);
  if (workspaceRoot) {
    const absolutePath = path.join(Uri.parse(workspaceRoot).fsPath, refPath);
    if (await fs.pathExists(absolutePath)) {
      return absolutePath;
    }
  }

  // const currentFile = getCurrentTextDocument()?.fileName;
  const currentFile = Uri.parse(document.uri).fsPath;
  if (currentFile) {
    const absolutePath = path.join(path.dirname(currentFile), refPath);
    if (await fs.pathExists(absolutePath)) {
      return absolutePath;
    }
  }

  return undefined;
}

export function getWorkspaceRootPath(document: Document): string | undefined {
  if (document) {
    const fileUri = document.uri;
    const workspaceFolder = workspace.getWorkspaceFolder(fileUri);
    if (workspaceFolder) {
      return workspaceFolder.uri.toString();
    }
  }
}
