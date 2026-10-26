import express from 'express';
import cors from 'cors';
import products from './routes/products.js';
import bookings from './routes/bookings.js';
import inquiries from './routes/inquiries.js';
import customers from './routes/customers.js';
import chat from './routes/chat.js';
import contact from './routes/contact.js';
import { notFound, errorHandler } from './middleware.js';

export const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()) }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/products', products);
app.use('/api/bookings', bookings);
app.use('/api/inquiries', inquiries);
app.use('/api/customers', customers);
app.use('/api/chat', chat);
app.use('/api/contact', contact);
app.use(notFound);
app.use(errorHandler);
