import * as path from "path";
import { workspace, Uri, Document } from "coc.nvim";

export function getCurrentHttpFileName(document: Document): string | undefined {
  // const document = getCurrentTextDocument();
  if (document) {
    // const filePath = document.fileName;
    const filePath = Uri.parse(document.uri).fsPath;
    return path.basename(filePath, path.extname(filePath));
  }
}

export function getWorkspaceRootPath(document: Document): string | undefined {
  // const document = getCurrentTextDocument();
  if (document) {
    const fileUri = document.uri;
    const workspaceFolder = workspace.getWorkspaceFolder(fileUri);
    if (workspaceFolder) {
      return workspaceFolder.uri.toString();
    }
  }
}

