import { assert } from "https://deno.land/std@0.61.0/testing/asserts.ts";
import { app } from './server.ts';
import { runBenchmarks, bench } from "https://deno.land/std/testing/bench.ts";
import api from 'https://deno.land/x/api/index.ts'

Deno.test('Default config', async () => {
    app;
    const res = await api.get('http://0.0.0.0:8080/hola');
    assert(res.name);
})

Deno.test('Default config 100 times', async () => {
    app;
    let res = {name: null};
    bench({
        name: 'call hola 1000 times',
        runs: 1000,
        async func(b): Promise<void> {
            b.start();
            res = await api.get('http://0.0.0.0:8080/hola');
            assert(res);
            b.stop();
        }
    })
    await runBenchmarks();
})
