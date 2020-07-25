# deno_server
A server that returns config file by environment and name composing them.

## Install deno:
```
brew install deno
deno upgrade --version 1.2.0
```

## Install denon (to redeploy automatically):
```
deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon/denon.ts
```

## Add deno to path
```
vi $HOME/.bash_profile
export PATH="/Users/cu47ek/.deno/bin:$PATH"
```

## Configure VSCode intstall these extensions
* Deno
* REST Client (optional)

## Run server:
```
denon run -A --unstable server.ts debug
```
Ctrl-c to kill the server

## Test server:
```
deno test -A --unstable
```
Ctrl-c to kill the server