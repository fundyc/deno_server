import { assert } from "./deps.test.ts";
import { app } from './server.ts';
import { runBenchmarks, bench } from "./deps.test.ts";
import { soxa } from './deps.test.ts'

Deno.test('Web config', async () => {
    app;
    const res = await soxa.get('http://0.0.0.0:8080/web');
    assert(res.data.name);
})

Deno.test('Web config 100 times', async () => {
    app;
    let res;
    bench({
        name: 'call for default config 1000 times',
        runs: 100,
        async func(b): Promise<void> {
            b.start();
            res = await soxa.get('http://0.0.0.0:8080/web');
            assert(res.data.name);
            b.stop();
        }
    })
    await runBenchmarks();
})
