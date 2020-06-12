import { workspace, Uri } from "coc.nvim";
import { HttpTextParser } from "./http/textParser";
import { HttpRequestParser } from "./http/requestParser";
import { HttpClient } from "./http/httpClient";

export const requestHandler = async () => {
  // get config
  const config = workspace.getConfiguration("rest-client");

  // get current doco text
  const document = await workspace.document;
  const rawText = document.textDocument.getText();

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
  // console.log("%o", httpRequest);

  let channel = name
    ? workspace.createOutputChannel(name)
    : workspace.createOutputChannel("rest-client");

  channel.clear();
  channel.show();
  channel.append(`Waiting for response from ${httpRequest.url}`);
  const channelBuffer = `output:///${channel.name}`;

  let httpClient = new HttpClient(config, document);
  try {
    const response = await httpClient.send(httpRequest);

    // check cancel
    if (httpRequest.isCancelled) {
      return;
    }

    channel.clear();
    channel.append(
      JSON.stringify(
        { Status: response.statusCode, Message: response.statusMessage },
        null,
        2
      )
    );
    channel.append(`\n\n`);

    if (config.showHeaders) {
      channel.append(JSON.stringify(response.headers, null, 2));
      channel.append(`\n\n`);
    }

    try {
      channel.append(JSON.stringify(JSON.parse(response.body), null, 2));
    } catch (error) {
      channel.append(response.body);
    }

    // console.log(response);
  } catch (error) {
    // check cancel
    if (httpRequest.isCancelled) {
      return;
    }

    if (error.code === "ETIMEDOUT") {
      error.message = `Please check your networking connectivity and your time out in ${this._restClientSettings.timeoutInMilliseconds}ms according to your configuration 'rest-client.timeoutinmilliseconds'. Details: ${error}. `;
    } else if (error.code === "ECONNREFUSED") {
      error.message = `Connection is being rejected. The service isn’t running on the server, or incorrect proxy settings in vscode, or a firewall is blocking requests. Details: ${error}.`;
    } else if (error.code === "ENETUNREACH") {
      error.message = `You don't seem to be connected to a network. Details: ${error}`;
    } else if (error.code === "ENOTFOUND") {
      error.message = `Address not found ${httpRequest.url}. Details: ${error}`;
    }
    workspace.showMessage(error.message, "error");
  }

  const bufs = await workspace.nvim.buffers;
  for (const buf of bufs) {
    const bufName = await buf.name;
    if (bufName === channelBuffer) {
      buf.setOption("ft", "json");
    }
  }
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
