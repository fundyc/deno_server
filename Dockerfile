FROM hayd/alpine-deno:1.2.0

# The port that your application listens to.
EXPOSE 8080

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY deps.ts .
RUN deno cache --unstable deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD config ./config
ADD server.ts .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache --unstable server.ts

CMD ["run", "--allow-env", "--allow-read", "--allow-net", "--unstable", "server.ts"]
