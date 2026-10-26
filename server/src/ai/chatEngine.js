import { SYSTEM_PROMPT } from './systemPrompt.js';
import { llmEnabled, llmAnswer } from './llm.js';

export const GREETING = 'Hello! I am the Vertexx booking assistant. Before we begin, may I have your full name?';
const CONTACT = 'You can reach our team on +91 9509108401 or praveengupta6452@gmail.com.';

const yes = (t) => /^(y|yes|yeah|yep|ok|okay|sure|confirm|correct|haan|han|ha|theek hai|thik hai)\b/i.test(t);
const no = (t) => /^(n|no|nope|nahi|nahin|na)\b/i.test(t);
const skip = (t) => /^(skip|none|nothing|no|n\/a|na|nahi|nahin)\b/i.test(t);
const asks = (t) => /\?\s*$/.test(t) || /^(what|how|why|when|which|who|where|kya|kaise|kitna|kitne|kab|kyun|batao)\b/i.test(t);
const money = (n) => '₹' + Number(n.toFixed(2)) + ' lakh';
const fmt = (d) => d.toISOString().slice(0, 10);
const todayUtc = (now = new Date()) => new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
const card = (p) => ({ slug: p.slug, name: p.name, type: p.type, priceFromLakh: p.priceFromLakh, leadTimeWeeks: p.leadTimeWeeks, description: p.description });

export function parseDate(text, now = new Date()) {
  const t = text.toLowerCase().trim();
  const base = todayUtc(now);
  const plus = (days) => new Date(base.getTime() + days * 864e5);
  const make = (y, m, d) => { const x = new Date(Date.UTC(y, m - 1, d)); return x.getUTCMonth() === m - 1 && x.getUTCDate() === d ? x : null; };
  let m;
  if (/^(today|aaj)$/.test(t)) return base;
  if (/^(tomorrow|kal)$/.test(t)) return plus(1);
  if (/^(day after tomorrow|parso)$/.test(t)) return plus(2);
  if (/^next week$/.test(t)) return plus(7);
  if (/^next month$/.test(t)) { const x = new Date(base); x.setUTCMonth(x.getUTCMonth() + 1); return x; }
  if ((m = t.match(/^in (\d{1,3}) (day|week|month)s?$/))) {
    if (m[2] === 'month') { const x = new Date(base); x.setUTCMonth(x.getUTCMonth() + Number(m[1])); return x; }
    return plus(Number(m[1]) * (m[2] === 'week' ? 7 : 1));
  }
  if ((m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) return make(+m[1], +m[2], +m[3]);
  if ((m = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/))) return make(+m[3], +m[2], +m[1]);
  return null;
}

async function answer(question, deps) {
  const hits = deps.retriever.search(question, 3);
  if (!hits.length) return `I do not have that information. ${CONTACT}`;
  if (llmEnabled()) {
    try { return await llmAnswer(SYSTEM_PROMPT, hits.map((h) => `${h.doc.title}: ${h.doc.text}`).join('\n'), question); } catch { /* fall back to retrieval */ }
  }
  const [top, second] = hits;
  return [top.doc.text, second && second.score > top.score * 0.6 ? second.doc.text : ''].filter(Boolean).join(' ');
}

function prompt(s, deps) {
  const d = s.data;
  const p = deps.products.find((x) => x.slug === d.productSlug);
  switch (s.stage) {
    case 'name': return { reply: 'May I have your full name?' };
    case 'email': return { reply: `Thanks, ${d.name}. What is your work email address?` };
    case 'phone': return { reply: 'And your phone number, so our team can call you?' };
    case 'company': return { reply: 'Which company are you with? Type skip if you are booking as an individual.', quick: ['Skip'] };
    case 'product':
      if (!deps.products.length) return { reply: `We have no products available to book right now. ${CONTACT}` };
      return { reply: `Thank you, ${d.name.split(' ')[0]}. Here is everything we offer. Which would you like to book? Reply with a name, or describe what you need and I will find the best fit.`, products: deps.products.map(card) };
    case 'quantity': return { reply: `${p.name} selected. How many units or sites do you need?` };
    case 'date': return { reply: `When do you need it? Type a date like 2026-12-15 or 15/12/2026, or say "in 8 weeks". Typical lead time for ${p.name} is ${p.leadTimeWeeks} weeks.` };
    case 'notes': return { reply: 'Any special requirements or notes for the team? Type skip if none.', quick: ['Skip'] };
    default:
      return {
        reply: [
          'Please check your booking:',
          `Name: ${d.name}${d.company ? ' (' + d.company + ')' : ''}`,
          `Contact: ${d.email}, ${d.phone}`,
          `Product: ${p.name}`,
          `Quantity: ${d.quantity}`,
          `Preferred date: ${d.date}`,
          `Notes: ${d.notes || 'none'}`,
          `Indicative starting cost: ${money(p.priceFromLakh * d.quantity)}`,
          'Shall I confirm this booking?',
        ].join('\n'),
        quick: ['Confirm', 'Change product', 'Change date', 'Cancel'],
      };
  }
}

const go = (s, stage, deps) => { s.stage = stage; return prompt(s, deps); };
const detour = async (t, s, deps) => {
  const a = await answer(t, deps);
  const p = prompt(s, deps);
  return { ...p, reply: `${a}\n\n${p.reply}` };
};

async function route(s, t, deps) {
  const d = s.data;
  const product = () => deps.products.find((x) => x.slug === d.productSlug);

  if (/^(restart|start over|reset)$/i.test(t)) { s.data = {}; s.stage = 'name'; return { reply: 'No problem, let us start again. May I have your full name?' }; }

  switch (s.stage) {
    case 'name':
      if (asks(t)) return detour(t, s, deps);
      if (!/^[\p{L}][\p{L} .'-]{1,59}$/u.test(t)) return { reply: 'Please enter your full name using letters only.' };
      d.name = t.replace(/\s+/g, ' ');
      return go(s, 'email', deps);
    case 'email':
      if (asks(t)) return detour(t, s, deps);
      if (!/^\S+@\S+\.\S+$/.test(t)) return { reply: 'That does not look like a valid email. Please enter it like name@company.com.' };
      d.email = t.toLowerCase();
      return go(s, 'phone', deps);
    case 'phone': {
      if (asks(t)) return detour(t, s, deps);
      const digits = t.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 13) return { reply: 'Please enter a valid phone number with 10 to 13 digits.' };
      d.phone = t.replace(/[^\d+]/g, '');
      return go(s, 'company', deps);
    }
    case 'company':
      if (skip(t)) d.company = '';
      else if (asks(t)) return detour(t, s, deps);
      else d.company = t.slice(0, 80);
      return go(s, 'product', deps);
    case 'product': {
      const list = deps.products;
      if (d.suggest) {
        const picked = list.find((x) => x.slug === d.suggest);
        delete d.suggest;
        if (yes(t) && picked) { d.productSlug = picked.slug; return go(s, 'quantity', deps); }
        if (no(t)) return prompt(s, deps);
      }
      const low = t.toLowerCase();
      const byNumber = /^\d{1,2}$/.test(t) ? list[Number(t) - 1] : null;
      const byName = list.find((x) => low === x.name.toLowerCase() || low === x.slug || low.includes(x.name.toLowerCase()));
      const chosen = byNumber || byName;
      if (chosen) { d.productSlug = chosen.slug; return go(s, 'quantity', deps); }
      if (asks(t)) return detour(t, s, deps);
      const hit = deps.retriever.search(t, 3).find((h) => h.doc.type === 'product');
      const match = hit && list.find((x) => x.slug === hit.doc.slug);
      if (match) {
        d.suggest = match.slug;
        return { reply: `That sounds like ${match.name}: ${match.description} It starts from ${money(match.priceFromLakh)} and takes about ${match.leadTimeWeeks} weeks. Shall I book it? (yes or no)`, quick: ['Yes', 'No, show the list'] };
      }
      return { ...prompt(s, deps), reply: 'I could not find a match for that. Please pick one from the list or describe what you need.' };
    }
    case 'quantity': {
      const n = /^\d{1,4}$/.test(t) ? Number(t) : NaN;
      if (n >= 1 && n <= 1000) { d.quantity = n; return go(s, 'date', deps); }
      if (asks(t)) return detour(t, s, deps);
      return { reply: 'Please enter a whole number between 1 and 1000.' };
    }
    case 'date': {
      const when = parseDate(t);
      if (!when) {
        if (asks(t)) return detour(t, s, deps);
        return { reply: 'I could not read that date. Try 2026-12-15, 15/12/2026, "tomorrow" or "in 8 weeks".' };
      }
      const today = todayUtc();
      if (when < today) return { reply: 'That date is in the past. Please give a date from today onwards.' };
      const earliest = new Date(today.getTime() + product().leadTimeWeeks * 7 * 864e5);
      if (when < earliest) return { reply: `${product().name} usually needs ${product().leadTimeWeeks} weeks, so the earliest realistic date is ${fmt(earliest)}. Please choose that date or later.` };
      d.date = fmt(when);
      return go(s, 'notes', deps);
    }
    case 'notes':
      d.notes = skip(t) ? '' : t.slice(0, 300);
      return go(s, 'confirm', deps);
    case 'confirm': {
      if (/change product|^product$/i.test(t)) return go(s, 'product', deps);
      if (/change date|^date$/i.test(t)) return go(s, 'date', deps);
      if (/change (quantity|qty)|^quantity$/i.test(t)) return go(s, 'quantity', deps);
      if (/^cancel/i.test(t)) { s.data = {}; s.stage = 'name'; return { reply: 'Booking cancelled. Whenever you are ready, tell me your full name and we will start again.' }; }
      if (!yes(t)) return asks(t) ? detour(t, s, deps) : { ...prompt(s, deps), reply: 'Please choose Confirm, Change product, Change date or Cancel.\n\n' + prompt(s, deps).reply };
      try {
        const b = await deps.createBooking({
          customer: { name: d.name, email: d.email, phone: d.phone, company: d.company },
          productId: d.productSlug, quantity: d.quantity, preferredDate: d.date, notes: d.notes, source: 'ai-chat',
        });
        s.stage = 'done';
        s.bookingId = b.bookingId;
        return {
          reply: `Your booking ${b.bookingId} is confirmed for ${product().name}. Our team will contact you at ${d.email} or ${d.phone} within one working day. Indicative starting cost: ${money(b.estimatedLakh)}.`,
          booking: { bookingId: b.bookingId, productName: product().name, quantity: d.quantity, preferredDate: d.date },
          quick: ['New booking'],
        };
      } catch (e) {
        return { ...prompt(s, deps), reply: `I could not complete the booking: ${e.message}.\n\n` + prompt(s, deps).reply };
      }
    }
    default: // done
      if (/new|another|book|yes|haan/i.test(t)) {
        s.data = { name: d.name, email: d.email, phone: d.phone, company: d.company };
        return go(s, 'product', deps);
      }
      return { reply: `Your booking ${s.bookingId} is already confirmed. Type "new booking" to book something else.`, quick: ['New booking'] };
  }
}

export async function handleMessage(session, text, deps) {
  const t = String(text || '').trim().slice(0, 500);
  if (!t) return { reply: 'Please type a message so I can help.' };
  session.messages.push({ role: 'user', text: t });
  const out = await route(session, t, deps);
  session.messages.push({ role: 'assistant', text: out.reply });
  return out;
}
