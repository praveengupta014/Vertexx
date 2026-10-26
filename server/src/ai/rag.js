import { Product, Knowledge } from '../models/index.js';
import { createRetriever, productDoc } from './retriever.js';

let cache = null;
export const invalidateIndex = () => { cache = null; };

// Builds the retrieval index from MongoDB (products + knowledge) and caches it until data changes.
export async function getRetriever() {
  if (!cache) {
    const [products, facts] = await Promise.all([Product.find({ active: true }).lean(), Knowledge.find().lean()]);
    cache = createRetriever([
      ...products.map(productDoc),
      ...facts.map((k) => ({ id: 'k:' + k._id, type: 'faq', title: k.title, text: k.text })),
    ]);
  }
  return cache;
}
