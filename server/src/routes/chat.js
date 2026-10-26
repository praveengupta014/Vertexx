import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { ChatSession, Product } from '../models/index.js';
import { wrap, httpError, rateLimit } from '../middleware.js';
import { handleMessage, GREETING } from '../ai/chatEngine.js';
import { getRetriever } from '../ai/rag.js';
import { createBooking } from '../services/bookingService.js';

const router = Router();
router.use(rateLimit(60));

router.post('/start', wrap(async (req, res) => {
  const s = await ChatSession.create({ sid: randomUUID(), stage: 'name', data: {}, messages: [{ role: 'assistant', text: GREETING }] });
  res.status(201).json({ sessionId: s.sid, reply: GREETING });
}));

router.post('/message', wrap(async (req, res) => {
  const { sessionId, message } = req.body || {};
  if (typeof sessionId !== 'string' || typeof message !== 'string') throw httpError(400, 'sessionId and message are required');
  const session = await ChatSession.findOne({ sid: sessionId });
  if (!session) throw httpError(404, 'Session not found. Please start a new chat.');
  if (session.messages.length > 300) throw httpError(400, 'This chat is too long. Please start a new one.');

  const deps = {
    products: await Product.find({ active: true }).sort({ type: 1, name: 1 }).lean(),
    retriever: await getRetriever(),
    createBooking,
  };
  const out = await handleMessage(session, message, deps);
  session.markModified('data');
  await session.save();
  res.json({ ...out, stage: session.stage });
}));

router.get('/:sid', wrap(async (req, res) => {
  const s = await ChatSession.findOne({ sid: req.params.sid }).lean();
  if (!s) throw httpError(404, 'Session not found');
  res.json({ stage: s.stage, messages: s.messages });
}));

export default router;
