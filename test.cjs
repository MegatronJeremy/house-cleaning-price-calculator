const { calc } = require('./docs/app.js');
const base = { sqft: 1800, baths: 2, bathmin: 20, rate: 35, supplies: 8, travel: 6, crew: 1, sp_standard: 400, sp_deep: 250, sp_move: 200, d_monthly: 5, d_biweekly: 10, d_weekly: 15 };
const cases = [
 [{ ...base, type: 'standard', freq: 'once' }, 4.5 + 40 / 60, (4.5 + 2 / 3) * 35 + 14],
 [{ ...base, type: 'deep', freq: 'weekly', sqft: 1000, baths: 1, crew: 2 }, 4 + 1 / 3, ((4 + 1 / 3) * 35 + 14) * 0.85],
 [{ ...base, type: 'move', freq: 'biweekly', sqft: 2400, baths: 3, rate: 40 }, 12 + 1, (13 * 40 + 14) * 0.9],
];
let bad = 0;
for (const [i, h, p] of cases) { const r = calc(i); const ok = Math.abs(r.hours - h) < 1e-9 && Math.abs(r.price - p) < 1e-9; console.log(ok ? 'ok' : 'FAIL', r.hours, r.price.toFixed(2), p.toFixed(2)); if (!ok) bad++; }
process.exit(bad);
