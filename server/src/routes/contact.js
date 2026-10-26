import { Router } from 'express';
import { Contact } from '../models/index.js';
import { admin, wrap, httpError, pick, rateLimit } from '../middleware.js';
import { sendContactNotification } from '../services/emailService.js';

const router = Router();

router.post('/', rateLimit(20), wrap(async (req, res) => {
  const body = pick(req.body, ['name', 'email', 'message', 'phone']);
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const message = String(body.message || '').trim();
  const phone = String(body.phone || '').trim();

  if (!name) throw httpError(400, 'Name is required');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw httpError(400, 'A valid email address is required');
  if (!message) throw httpError(400, 'Message cannot be empty');

  // 1. Save in database
  const contact = await Contact.create({
    name,
    email,
    message,
    phone,
  });

  // 2. Dispatch email notification to praveengupta6452@gmail.com
  sendContactNotification({ name, email, message, phone }).catch((err) => {
    console.error('[Contact Route] Failed to send email notification:', err);
  });

  res.status(201).json({
    ok: true,
    id: contact._id,
    message: 'Your message has been sent successfully. We will get back to you soon!',
  });
}));

router.get('/', admin, wrap(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json(contacts);
}));

export default router;
