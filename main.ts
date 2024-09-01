import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'

const app = new Hono()

app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.use('/', serveStatic({root: './static/'}))
app.get('/random', (c) => {
    const min = parseInt(c.req.query('min') || '0');
    const max = parseInt(c.req.query('max') || '100');
    const count = parseInt(c.req.query('count') || '1');

    // minとmaxの範囲チェック
    if (min >= max) {
        return c.json({ error: 'Minimum value must be less than maximum value' }, 400);
    }

    // countの範囲チェック
    if (count <= 0) {
        return c.json({ error: 'Count must be a positive number' }, 400);
    }

    // 範囲内の数値リストを作成
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    // リストをシャッフル
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // 指定された個数分の乱数を取得
    const randomNumbers = numbers.slice(0, count);

    return c.json({ numbers: randomNumbers });
});
app.get('*', serveStatic({ path: './static/fallback.txt' }))

Deno.serve(app.fetch)