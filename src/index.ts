import { ExtensionContext, workspace, commands } from "coc.nvim";

import { requestHandler } from "./command";

export async function activate(context: ExtensionContext) {
  const config = workspace.getConfiguration("http");
  const isEnable = config.get<boolean>("enable", true);
  if (!isEnable) {
    return;
  }
  context.subscriptions.push(
    commands.registerCommand("rest-client.request", requestHandler)
  );
}

