// Local retrieval for RAG: BM25 over product and FAQ documents. No embeddings and no external API.
const STOP = new Set('a an the is are was were be to of and or for in on at by with from it this that i we you your our my me can do does how what which who when where please tell about need want have has will would'.split(' '));
// Small synonym map so that common Hinglish / alternate words hit the right documents.
const SYN = { kimat: 'price', daam: 'price', rate: 'price', cost: 'price', charges: 'price', fees: 'price', samay: 'timeline', time: 'timeline', delivery: 'timeline', bijli: 'energy', power: 'energy', godown: 'warehouse', gudam: 'warehouse', camera: 'vision', defects: 'defect' };

const stem = (w) => (w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '') : w);
export const tokenize = (text) =>
  (String(text).toLowerCase().match(/[a-z0-9]+/g) || [])
    .map((w) => SYN[w] || w)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);

export const productDoc = (p) => ({
  id: 'p:' + p.slug,
  type: 'product',
  slug: p.slug,
  title: p.name,
  text: `${p.name} is a ${String(p.type).toLowerCase()} for ${(p.industries || []).join(', ')}. ${p.description} Features: ${(p.features || []).join(', ')}. Starting price ${p.priceFromLakh} lakh rupees. Typical timeline ${p.leadTimeWeeks} weeks.`,
});

export function createRetriever(docs, k1 = 1.5, b = 0.75) {
  const items = docs.map((doc) => {
    const toks = tokenize(`${doc.title} ${doc.title} ${doc.text}`);
    const tf = new Map();
    toks.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    return { doc, tf, len: toks.length };
  });
  const N = items.length || 1;
  const avg = items.reduce((s, i) => s + i.len, 0) / N || 1;
  const df = new Map();
  items.forEach((i) => i.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const idf = (t) => Math.log(1 + (N - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5));

  return {
    search(query, limit = 3) {
      const q = [...new Set(tokenize(query))];
      return items
        .map((i) => ({
          doc: i.doc,
          score: q.reduce((s, t) => {
            const f = i.tf.get(t) || 0;
            return f ? s + (idf(t) * f * (k1 + 1)) / (f + k1 * (1 - b + (b * i.len) / avg)) : s;
          }, 0),
        }))
        .filter((r) => r.score > 0)
        .sort((a, c) => c.score - a.score)
        .slice(0, limit);
    },
  };
}
