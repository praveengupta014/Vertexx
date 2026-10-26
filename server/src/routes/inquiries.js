import { Router } from 'express';
import { Lead, LEAD_STATUS, nextSeq } from '../models/index.js';
import { admin, wrap, httpError, pick, rateLimit } from '../middleware.js';
import { sendLeadNotification } from '../services/emailService.js';

const router = Router();

router.post('/', rateLimit(20), wrap(async (req, res) => {
  const body = pick(req.body, ['name', 'company', 'email', 'phone', 'items', 'industry', 'budget', 'timeline', 'mode']);
  if (!body.name || !/^\S+@\S+\.\S+$/.test(String(body.email || ''))) throw httpError(400, 'Name and a valid email are required');
  body.items = (Array.isArray(body.items) ? body.items : []).slice(0, 20).map(String);
  const lead = await Lead.create({ ...body, leadId: 'LD-' + (await nextSeq('lead')) });
  sendLeadNotification(lead).catch((err) => console.error('[Inquiries] Email notification error:', err));
  res.status(201).json({ leadId: lead.leadId, status: lead.status });
}));

router.get('/', admin, wrap(async (req, res) => {
  const filter = req.query.status ? { status: String(req.query.status) } : {};
  res.json(await Lead.find(filter).sort({ createdAt: -1 }).limit(200).lean());
}));

router.patch('/:leadId/status', admin, wrap(async (req, res) => {
  if (!LEAD_STATUS.includes(req.body?.status)) throw httpError(400, `status must be one of: ${LEAD_STATUS.join(', ')}`);
  const lead = await Lead.findOneAndUpdate({ leadId: req.params.leadId }, { status: req.body.status }, { new: true });
  if (!lead) throw httpError(404, 'Lead not found');
  res.json({ leadId: lead.leadId, status: lead.status });
}));

export default router;
