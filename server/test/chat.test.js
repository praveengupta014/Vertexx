import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { handleMessage, parseDate } from '../src/ai/chatEngine.js';
import { createRetriever, productDoc } from '../src/ai/retriever.js';

const read = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));
const products = read('../src/seed/products.json');
const facts = read('../src/seed/knowledge.json');
const flow = products.find((p) => p.slug === 'flow');

const deps = (created = []) => ({
  products,
  retriever: createRetriever([...products.map(productDoc), ...facts.map((k, i) => ({ id: 'k' + i, type: 'faq', title: k.title, text: k.text }))]),
  createBooking: async (b) => { created.push(b); return { bookingId: 'VTX-1001', estimatedLakh: flow.priceFromLakh * b.quantity }; },
});
const fresh = () => ({ stage: 'name', data: {}, messages: [] });
const say = async (s, d, ...msgs) => { let out; for (const m of msgs) out = await handleMessage(s, m, d); return out; };

test('details first, then product list, then a booking is created', async () => {
  const created = [], d = deps(created), s = fresh();
  let out = await say(s, d, 'Rahul Sharma', 'rahul@acme.com', '+91 98290 12345');
  assert.equal(s.stage, 'company');
  assert.equal(out.products, undefined, 'product list must not appear before details are collected');
  out = await say(s, d, 'skip');
  assert.equal(s.stage, 'product');
  assert.equal(out.products.length, products.length);
  await say(s, d, flow.name, '2', 'in 20 weeks', 'skip');
  assert.equal(s.stage, 'confirm');
  out = await say(s, d, 'confirm');
  assert.equal(s.stage, 'done');
  assert.equal(out.booking.bookingId, 'VTX-1001');
  assert.equal(created[0].productId, 'flow');
  assert.equal(created[0].quantity, 2);
  assert.equal(created[0].source, 'ai-chat');
  assert.equal(created[0].customer.email, 'rahul@acme.com');
});

test('validates input and answers questions without losing the current step', async () => {
  const d = deps(), s = fresh();
  let out = await say(s, d, 'what are your support hours?');
  assert.equal(s.stage, 'name');
  assert.match(out.reply, /Monday/);
  assert.match(out.reply, /full name/);
  await say(s, d, 'Asha Rao', 'not-an-email');
  assert.equal(s.stage, 'email');
});

test('RAG suggests a product from a free-text need', async () => {
  const d = deps(), s = fresh();
  await say(s, d, 'Asha Rao', 'asha@acme.com', '9829012345', 'skip');
  let out = await say(s, d, 'I need robots to speed up picking');
  assert.equal(s.stage, 'product');
  assert.match(out.reply, /Vertexx Flow/);
  out = await say(s, d, 'yes');
  assert.equal(s.stage, 'quantity');
  assert.equal(s.data.productSlug, 'flow');
});

test('rejects a date earlier than the lead time', async () => {
  const d = deps(), s = fresh();
  await say(s, d, 'Asha Rao', 'asha@acme.com', '9829012345', 'skip', flow.name, '1');
  const out = await say(s, d, 'in 1 weeks');
  assert.equal(s.stage, 'date');
  assert.match(out.reply, /earliest/);
});

test('parseDate understands common formats', () => {
  const now = new Date(2026, 9, 23);
  const iso = (x) => x && x.toISOString().slice(0, 10);
  assert.equal(iso(parseDate('tomorrow', now)), '2026-10-24');
  assert.equal(iso(parseDate('in 2 weeks', now)), '2026-11-06');
  assert.equal(iso(parseDate('15/12/2026', now)), '2026-12-15');
  assert.equal(iso(parseDate('2026-12-15', now)), '2026-12-15');
  assert.equal(parseDate('2026-02-30', now), null);
  assert.equal(parseDate('whenever', now), null);
});
