const SYMBOLS = [
  { id: 'GSPC', sym: '^GSPC', name: 'S&P 500' },
  { id: 'TWII', sym: '^TWII', name: '台股加權' },
  { id: 'N225', sym: '^N225', name: '日經 225' },
  { id: 'HSI',  sym: '^HSI',  name: '恆生指數' },
  { id: 'KS11', sym: '^KS11', name: 'KOSPI' },
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  const results = await Promise.allSettled(
    SYMBOLS.map(m => fetchOne(m.sym).then(q => ({ ...m, ...q })))
  );

  const data = {};
  results.forEach((r, i) => {
    data[SYMBOLS[i].id] = r.status === 'fulfilled'
      ? r.value
      : { ...SYMBOLS[i], price: null, prev: null, pct: null };
  });

  res.status(200).json(data);
};

async function fetchOne(sym) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=2d`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
    signal: AbortSignal.timeout(7000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  const meta = d.chart.result[0].meta;
  const price = meta.regularMarketPrice;
  const prev  = meta.chartPreviousClose || meta.previousClose || price;
  const pct   = prev ? (price - prev) / prev * 100 : 0;
  return { price, prev, pct, change: price - prev };
}
