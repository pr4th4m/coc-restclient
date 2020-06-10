import { workspace, Uri } from "coc.nvim";
import { HttpTextParser } from "./http/textParser";
import { HttpRequestParser } from "./http/requestParser";
import { HttpClient } from "./http/httpClient";

export const requestHandler = async () => {
  // get config
  const config = workspace.getConfiguration("rest-client");

  // get current doco text
  const document = await workspace.document;

  // console.log(Uri.parse(document.uri).fsPath);
  // console.log(workspace.getWorkspaceFolder(document.uri));
  // console.log(workspace.getWorkspaceFolder(document.uri).uri);

  const rawText = document.textDocument.getText();

  // console.log(workspace.workspaceFolder.uri);
  // console.log(workspace.uri);

  // get current cursor position
  const pos = await workspace.getCursorPosition();

  let parser = new HttpTextParser();

  const selectedRequest = parser.getRequest(rawText, pos.line);
  if (!selectedRequest) {
    return;
  }

  const { text, name, warnBeforeSend } = selectedRequest;

  if (warnBeforeSend) {
    const warning = name
      ? `Are you sure you want to send the request "${name}"?`
      : "Are you sure you want to send this request?";
    const userConfirmed = await workspace.showPrompt(warning);
    if (!userConfirmed) {
      return;
    }
  }

  // TODO: Support different request parsers
  const httpRequest = await new HttpRequestParser(
    text,
    config
  ).parseHttpRequest(name);

  let httpClient = new HttpClient(config, document);
  const response = await httpClient.send(httpRequest);
  console.log(response);
};

// let selectedText = text;
// let selectedText = getDelimitedText(text, pos.line);
// console.log(selectedText);

// let matched = selectedText.match(RequestVariableDefinitionRegex);
// console.log(matched);

// const rawLines = selectedText
//   .split(LineSplitterRegex)
//   .filter((l) => !CommentIdentifiersRegex.test(l));
// // console.log(rawLines);
//
// const requestRange = getRequestRanges(rawLines)[0];
// // console.log(requestRange);
//
// selectedText = rawLines.slice(requestRange[0], requestRange[1] + 1).join(EOL);
// // console.log(selectedText);
//
// parseHttpRequest(selectedText);

// const requestRange = this.getRequestRanges(rawLines)[0];
// if (!requestRange) {
//   return null;
// }

// let range = await workspace.getSelectedRange("v", document);
// console.log(range);

// let wins = await workspace.nvim.windows;
// console.log(wins.length);
// let buf = await workspace.nvim.createNewBuffer(true, true);
// buf.insert("love you", 0);

// let state = await workspace.getCurrentState();
// console.log(state.document);
// console.log(state.position);

// let channel = workspace.createOutputChannel("http");
// channel.show();
// channel.append(data);

// let win = await workspace.nvim.createWindow(0);
// let buf = await win.buffer;
// buf.insert("love you", 0);
// buf.append("love you");
