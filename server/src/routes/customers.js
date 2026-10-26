import { Router } from 'express';
import { Customer, Booking } from '../models/index.js';
import { admin, wrap, httpError } from '../middleware.js';

const router = Router();
router.use(admin);

router.get('/', wrap(async (req, res) => {
  const q = String(req.query.q || '').trim();
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filter = q ? { $or: [{ name: new RegExp(esc, 'i') }, { email: new RegExp(esc, 'i') }, { company: new RegExp(esc, 'i') }] } : {};
  res.json(await Customer.find(filter).sort({ createdAt: -1 }).limit(200).lean());
}));

router.get('/:id/bookings', wrap(async (req, res) => {
  const c = await Customer.findById(req.params.id).lean();
  if (!c) throw httpError(404, 'Customer not found');
  res.json({ customer: c, bookings: await Booking.find({ customer: c._id }).sort({ createdAt: -1 }).lean() });
}));

export default router;
