import { Router } from 'express';
import { Product } from '../models/index.js';
import { admin, wrap, httpError, pick } from '../middleware.js';
import { invalidateIndex } from '../ai/rag.js';

const router = Router();
const FIELDS = ['slug', 'name', 'type', 'industries', 'description', 'features', 'priceFromLakh', 'leadTimeWeeks', 'active'];
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', wrap(async (req, res) => {
  const { type, industry, q, sort } = req.query;
  const filter = { active: true };
  if (type) filter.type = String(type);
  if (industry) filter.industries = String(industry);
  if (q) filter.$or = ['name', 'description'].map((k) => ({ [k]: new RegExp(esc(q), 'i') }));
  const order = { name: { name: 1 }, price: { priceFromLakh: 1 }, timeline: { leadTimeWeeks: 1 } }[sort] || { name: 1 };
  res.json(await Product.find(filter).sort(order).lean());
}));

router.get('/:slug', wrap(async (req, res) => {
  const p = await Product.findOne({ slug: req.params.slug, active: true }).lean();
  if (!p) throw httpError(404, 'Product not found');
  res.json(p);
}));

router.post('/', admin, wrap(async (req, res) => {
  const p = await Product.create(pick(req.body, FIELDS));
  invalidateIndex();
  res.status(201).json(p);
}));

router.put('/:slug', admin, wrap(async (req, res) => {
  const p = await Product.findOneAndUpdate({ slug: req.params.slug }, { $set: pick(req.body, FIELDS) }, { new: true, runValidators: true });
  if (!p) throw httpError(404, 'Product not found');
  invalidateIndex();
  res.json(p);
}));

// Soft delete: the product stays in old bookings but disappears from the catalogue and the assistant.
router.delete('/:slug', admin, wrap(async (req, res) => {
  const p = await Product.findOneAndUpdate({ slug: req.params.slug }, { active: false }, { new: true });
  if (!p) throw httpError(404, 'Product not found');
  invalidateIndex();
  res.json({ ok: true });
}));

export default router;
