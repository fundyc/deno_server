import { Server, Router } from "https://deno.land/x/http_wrapper@v0.5.0/mod.ts";
import { exists, readJson } from "https://deno.land/std@0.61.0/fs/mod.ts";

import * as log from "https://deno.land/std@0.61.0/log/mod.ts";

const debug = Deno.args[0];
if (debug && debug.toUpperCase() === "DEBUG") {
  await log.setup({
    handlers: {
      default: new log.handlers.ConsoleHandler('DEBUG'),
    },

    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["default"],
      },
    },
  });
}

const router = new Router();
router.get("/", async (req) => {
  req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      test: "This is a test",
    }),
  });
});

router.get("/{name}", async (req, { param }) => {
  const env_cookie = req.headers.get("cookie")?.replace(/(?:(?:^|.*;\s*)env\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  const env = env_cookie ? env_cookie : "dev";
  const file = "./config/" + env + "_" + param.name + ".json";
  const file_default= "./config/" + env + ".json";
  log.debug("env_cookie = " + env_cookie + " | env = " + env + " | file = " + file);

  let body;
  if (await exists(file_default)) {
    body = await readJson(file_default);
    log.debug("default = " + JSON.stringify(body));
  }

  if (await exists(file)) {
    const body_file = await readJson(file);
    log.debug(param.name + " = " + JSON.stringify(body_file));
    Object.assign(body, body_file);
    log.debug("composed = " + JSON.stringify(body));
  }
 
  if (body) {
    req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(body)
    });
  } else {
    body = {error: "File not found"};
    log.debug(body);

    req.respond({
      status: 404,
      body: JSON.stringify(body)
    });
  }
});

export const app = new Server();
app.use(router.routes);
app
  .start({ port: 8080 })
  .then((config) => log.info("Server running on localhost:"+config.port));
