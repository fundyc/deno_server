import { assertStrictEquals } from "./deps.test.ts";
import { app } from './server.ts';
import { runBenchmarks, bench } from "./deps.test.ts";
import { soxa } from './deps.test.ts'

Deno.test('Healthy server', async () => {
    app;
    const res = await soxa.get('http://0.0.0.0:8080/healthy');
    assertStrictEquals(res.data.status, 'OK');
})

Deno.test('Default dev config', async () => {
    app;
    const res = await soxa.get('http://0.0.0.0:8080/default');
    assertStrictEquals(res.data.type, 'default');
    assertStrictEquals(res.data.environment, 'dev');
})

Deno.test('Web dev config', async () => {
    app;
    const res = await soxa.get('http://0.0.0.0:8080/web');
    assertStrictEquals(res.data.type, 'web');
    assertStrictEquals(res.data.environment, 'dev');
})

Deno.test('Mobile dev config', async () => {
    app;
    const res = await soxa.get('http://0.0.0.0:8080/mobile');
    assertStrictEquals(res.data.type, 'mobile');
    assertStrictEquals(res.data.environment, 'dev');
})

Deno.test('Default test config', async () => {
    app;
    const res = await soxa.get('http://0.0.0.0:8080/default', {headers: {'Cookie': 'env=test'}});
    assertStrictEquals(res.data.type, 'default');
    assertStrictEquals(res.data.environment, 'test');
})

Deno.test('Mobile test config', async () => {
    app;
    const res = await soxa.get('http://0.0.0.0:8080/mobile', {headers: {'Cookie': 'env=test'}});
    assertStrictEquals(res.data.type, 'mobile');
    assertStrictEquals(res.data.environment, 'test');
})

Deno.test('Web deb config 1000 times', async () => {
    app;
    let res;
    bench({
        name: 'call for default config 1000 times',
        runs: 1000,
        async func(b): Promise<void> {
            b.start();
            res = await soxa.get('http://0.0.0.0:8080/web');
            assertStrictEquals(res.data.type, 'web');
            assertStrictEquals(res.data.environment, 'dev');
            b.stop();
        }
    })
    await runBenchmarks();
})
