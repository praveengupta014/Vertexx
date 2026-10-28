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
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '100kb' }));

const apiInfo = (req, res) => res.json({
  name: 'Vertexx Automation API',
  status: 'online',
  endpoints: ['/api/health', '/api/products', '/api/bookings', '/api/inquiries', '/api/contact', '/api/chat'],
});

app.get('/', apiInfo);
app.get('/api', apiInfo);
app.get(['/health', '/api/health'], (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));
app.use(['/products', '/api/products'], products);
app.use(['/bookings', '/api/bookings'], bookings);
app.use(['/inquiries', '/api/inquiries'], inquiries);
app.use(['/customers', '/api/customers'], customers);
app.use(['/chat', '/api/chat'], chat);
app.use(['/contact', '/api/contact'], contact);
app.use(notFound);
app.use(errorHandler);
