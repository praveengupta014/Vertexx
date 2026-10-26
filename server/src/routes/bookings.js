import { Router } from 'express';
import { Booking, BOOKING_STATUS } from '../models/index.js';
import { admin, wrap, httpError, rateLimit } from '../middleware.js';
import { createBooking } from '../services/bookingService.js';

const router = Router();

// Public: create a booking (the AI chat uses the same service).
router.post('/', rateLimit(20), wrap(async (req, res) => {
  const { customer, productId, quantity, preferredDate, notes } = req.body || {};
  const b = await createBooking({ customer, productId, quantity, preferredDate, notes, source: 'api' });
  res.status(201).json({ bookingId: b.bookingId, status: b.status, estimatedLakh: b.estimatedLakh });
}));

// Public: a customer checks the status of their own booking with booking id + email.
router.get('/track/:bookingId', rateLimit(30), wrap(async (req, res) => {
  const b = await Booking.findOne({ bookingId: req.params.bookingId }).populate('customer', 'email').lean();
  if (!b || b.customer.email !== String(req.query.email || '').toLowerCase()) throw httpError(404, 'Booking not found');
  res.json({ bookingId: b.bookingId, status: b.status, productName: b.productName, quantity: b.quantity, preferredDate: b.preferredDate });
}));

router.get('/', admin, wrap(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const filter = {};
  if (req.query.status) filter.status = String(req.query.status);
  const [items, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('customer', 'name email phone company').lean(),
    Booking.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}));

router.get('/:bookingId', admin, wrap(async (req, res) => {
  const b = await Booking.findOne({ bookingId: req.params.bookingId }).populate('customer').populate('product').lean();
  if (!b) throw httpError(404, 'Booking not found');
  res.json(b);
}));

router.patch('/:bookingId/status', admin, wrap(async (req, res) => {
  if (!BOOKING_STATUS.includes(req.body?.status)) throw httpError(400, `status must be one of: ${BOOKING_STATUS.join(', ')}`);
  const b = await Booking.findOneAndUpdate({ bookingId: req.params.bookingId }, { status: req.body.status }, { new: true });
  if (!b) throw httpError(404, 'Booking not found');
  res.json({ bookingId: b.bookingId, status: b.status });
}));

export default router;
