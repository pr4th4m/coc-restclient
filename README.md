# coc-restclient

Trying to port features from [vscode-restclient](https://github.com/Huachao/vscode-restclient) to [coc.nvim](https://github.com/neoclide/coc.nvim)

[![asciicast](https://asciinema.org/a/BoLZbJrIfGZIYkSStT0UClo5B.svg)](https://asciinema.org/a/BoLZbJrIfGZIYkSStT0UClo5B)

## Install

```sh
:CocInstall coc-restclient
```

## Sample requests

- [Single request](test/sample/single.http)
- [Multiple request](test/sample/multiple.http)

## Commands

Use commands with `:CocCommand <command>`

- `rest-client.request` : Send http request

## Configuration

[Use configurations with `:CocConfig` or `$HOME/.config/nvim/coc-settings.json`](./test/sample/coc-settings.sample.json)

- `rest-client.enable` : `true`
- `rest-client.showHeaders` : `true`
- `rest-client.proxy` : `""`
- `rest-client.proxyStrictSSL` : `false`
- `rest-client.excludeHostsForProxy` : `[]`
- `rest-client.timeoutinmilliseconds` : `0`
- `rest-client.followredirect` : `true`
- `rest-client.certificates` : `{}`

[More configuration options here](https://github.com/pr4th4m/coc-restclient/blob/master/package.json#L28)

## Key binding

- Replace `<Leader>0` with key which you are comfortable with

  ```sh
  noremap <Leader>0 :CocCommand rest-client.request <cr>
  ```

## Features ported

- [x] Send http request
- [x] Multiple requests in same file separated by `###` delimiter
- [x] Proxy support
- [ ] Cancel http request
- [ ] Variable substitution
- [ ] GraphQL query
- [ ] Curl command

## TODO

- Support visual select for multiple requests
- Save response `application/gzip` to file
- Organize source code in better way
