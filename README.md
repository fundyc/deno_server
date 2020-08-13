# deno_server
A server that returns config file by composing environment (cookie) and device (path_param) files.

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

## Make your docker image
```
docker build -t deno-server .
```

## View your docker images
```
docker images
```

## Run your docker image in a container (Can be closed with ctrl-c)
```
docker run --name deno-server --rm --init -p 8080:8080 deno-server
```

## View your docker containers
```
docker ps -a
```

## Remove your old docker images and containers not used
```
docker system prune
```