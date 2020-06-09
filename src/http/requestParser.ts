import { EOL } from "os";

import { RequestParser } from "../models/requestParser";
import { HttpRequest } from "../models/httpRequest";
import { WorkspaceConfiguration } from "coc.nvim";

import { parseRequestHeaders } from "./requestHeaderParser";

enum ParseState {
  URL,
  Header,
  Body,
}

export class HttpRequestParser implements RequestParser {
  private readonly defaultMethod = "GET";
  private readonly queryStringLinePrefix = /^\s*[&\?]/;

  public constructor(
    private requestRawText: string,
    private settings: WorkspaceConfiguration
  ) {}

  public async parseHttpRequest(name?: string): Promise<HttpRequest> {
    console.log("in here");
    // parse follows http://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html
    // split the request raw text into lines
    const lines: string[] = this.requestRawText.split(EOL);
    const requestLines: string[] = [];
    const headersLines: string[] = [];
    const bodyLines: string[] = [];
    const variableLines: string[] = [];

    let state = ParseState.URL;
    let currentLine: string | undefined;
    while ((currentLine = lines.shift()) !== undefined) {
      const nextLine = lines[0];
      switch (state) {
        case ParseState.URL:
          requestLines.push(currentLine.trim());
          if (
            nextLine === undefined ||
            this.queryStringLinePrefix.test(nextLine)
          ) {
            // request with request line only
          } else if (nextLine.trim()) {
            state = ParseState.Header;
          } else {
            // request with no headers but has body
            // remove the blank line before the body
            lines.shift();
            state = ParseState.Body;
          }
          break;
        case ParseState.Header:
          headersLines.push(currentLine.trim());
          if (nextLine?.trim() === "") {
            // request with no headers but has body
            // remove the blank line before the body
            lines.shift();
            state = ParseState.Body;
          }
          break;
        case ParseState.Body:
          bodyLines.push(currentLine);
          break;
      }
    }

    // parse request line
    const requestLine = this.parseRequestLine(requestLines.join(EOL));
    console.log(requestLine);

    // // parse headers lines
    // const headers = parseRequestHeaders(
    //   headersLines,
    //   this.settings.defaultHeaders,
    //   requestLine.url
    // );
    //
    // console.log(headers);

    return null;
  }

  private parseRequestLine(line: string): { method: string; url: string } {
    // Request-Line = Method SP Request-URI SP HTTP-Version CRLF
    const words = line.split(" ").filter(Boolean);

    let method: string;
    let url: string;
    if (words.length === 1) {
      // Only provides request url
      method = this.defaultMethod;
      url = words[0];
    } else {
      // Provides both request method and url
      method = words.shift()!;
      url = line.trim().substring(method.length).trim();
      if (/^HTTP\/.*$/i.test(words[words.length - 1])) {
        url = url.substring(0, url.lastIndexOf(words[words.length - 1])).trim();
      }
    }

    return { method, url };
  }
}
