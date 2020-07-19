import { Server, Router } from "https://deno.land/x/http_wrapper@v0.5.0/mod.ts";
import { exists, readJson } from "https://deno.land/std/fs/mod.ts";

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
  console.log(env_cookie + " : " + env + " : " + file);

  let body;
  if (await exists(file_default)) {
    body = await readJson(file_default);
    console.log("default ===== " + JSON.stringify(body));
  }

  if (await exists(file)) {
    const body_file = await readJson(file);
    console.log("new ========= " + JSON.stringify(body_file));
    Object.assign(body, body_file);
    console.log("composition = " + JSON.stringify(body));
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
    const body_not_found = JSON.stringify({error: "File not found"});
    console.log(body_not_found);
    req.respond({
      status: 404,
      body: body_not_found
    });
  }
});

const app = new Server();
app.use(router.routes);
app
  .start({ port: 8080 })
  .then((config) => console.log(`Server running on localhost:${config.port}`));
