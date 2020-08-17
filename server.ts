import { Server, Router } from './deps.ts';
import { exists, readJson } from "./deps.ts";
import { log } from "./deps.ts";

// Log level is selected by enviroment variable LOG_LEVEL or by first parameter
let debug = Deno.env.get("LOG_LEVEL");
if (Deno.args[0]) {
  debug = Deno.args[0];
}
if (debug && debug.toUpperCase() === "DEBUG") {
  log.info("log level = DEBUG");
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

// healthy endpoint used to know if the server is up and running
const router = new Router();
router.get("/healthy", async (req) => {
  req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      status: "OK",
      desription: "Server is up and running.",
      version: "1.0.0"
    }),
  });
});

// return the json config file
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

// Run the server
export const app = new Server();
app.use(router.routes);
app
  .start({ port: 8080 })
  .then((config) => log.info("Server running on localhost:"+config.port));