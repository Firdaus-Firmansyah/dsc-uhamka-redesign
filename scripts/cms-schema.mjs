export function parseRows(rows) {
  if (!Array.isArray(rows) || rows.length < 2) throw new Error('Sheet must contain a header and at least one content row.');
  const fields = ['slug', 'title', 'description', 'content'];
  const header = rows[0].map(v => String(v).trim());
  if (fields.some(f => header.filter(h => h === f).length !== 1)) throw new Error('Required unique columns: slug, title, description, content.');
  const seen = new Set();
  return rows.slice(1).filter(row => row.some(v => String(v).trim())).map((row, i) => {
    const item = Object.fromEntries(fields.map(f => [f, String(row[header.indexOf(f)] ?? '').trim()]));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || item.slug.length > 80 || seen.has(item.slug)) throw new Error(`Invalid or duplicate slug at row ${i + 2}.`);
    if (!item.title || item.title.length > 160 || !item.description || item.description.length > 500 || !item.content || item.content.length > 50000) throw new Error(`Invalid content at row ${i + 2}.`);
    seen.add(item.slug);
    return item;
  });
}
