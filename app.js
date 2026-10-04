'use strict';
const $ = (id) => document.getElementById(id);
const num = (id) => { const v = parseFloat($(id).value); return Number.isFinite(v) && v >= 0 ? v : 0; };
const money = (n) => '$' + n.toFixed(2);

function calc(i) {
  const perHour = i['sp_' + i.type] > 0 ? i['sp_' + i.type] : 1;
  const hours = i.sqft / perHour + (i.baths * i.bathmin) / 60;
  const disc = i.freq === 'once' ? 0 : i['d_' + i.freq];
  const costs = i.supplies + i.travel;
  const before = hours * i.rate + costs;
  const price = before * (1 - disc / 100);
  const profitHr = hours > 0 ? (price - costs) / hours : 0;
  const crew = i.crew >= 1 ? i.crew : 1;
  const visits = { once: 1, monthly: 1, biweekly: 26 / 12, weekly: 52 / 12 }[i.freq];
  return { hours, disc, before, price, profitHr, onsite: hours / crew, monthly: price * visits, costs };
}

function read() {
  const i = { type: $('type').value, freq: $('freq').value };
  for (const k of ['sqft', 'baths', 'crew', 'rate', 'supplies', 'travel', 'bathmin', 'sp_standard', 'sp_deep', 'sp_move', 'd_monthly', 'd_biweekly', 'd_weekly']) i[k] = num(k);
  return i;
}

function render() {
  const i = read();
  const r = calc(i);
  $('price').textContent = '$' + Math.round(r.price);
  $('sub').textContent = 'per job (exact ' + money(r.price) + ')';
  const rows = [
    ['Labor hours (total)', r.hours.toFixed(2) + ' h'],
    ['Time on site with ' + (i.crew || 1) + ' cleaner(s)', r.onsite.toFixed(2) + ' h'],
    ['Price before frequency discount', money(r.before)],
    ['Frequency discount', r.disc + '%'],
    ['Supplies + travel', money(r.costs)],
    ['Pay per labor-hour after costs', money(r.profitHr)],
  ];
  if (i.freq !== 'once') rows.push(['Approx. per month at this frequency', money(r.monthly)]);
  $('rows').innerHTML = rows.map((x) => '<div class="row"><span>' + x[0] + '</span><b>' + x[1] + '</b></div>').join('');
  $('warn').textContent = r.profitHr + 0.005 < i.rate ? 'The discount pushes your pay per labor-hour below your target of ' + money(i.rate) + '. Consider a smaller discount.' : '';
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('input,select').forEach((e) => e.addEventListener('input', render));
  render();
}
if (typeof module !== 'undefined') module.exports = { calc };
