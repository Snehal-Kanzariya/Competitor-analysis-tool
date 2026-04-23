export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query' });
  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`
    );
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: 'DDG fetch failed' });
  }
}
