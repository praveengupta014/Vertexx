import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui';
import { post } from '../api.js';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const sid = useRef(null);
  const end = useRef(null);
  const push = (m) => setMsgs((x) => [...x, m]);

  const start = async () => {
    setBusy(true); setErr('');
    try {
      const j = await post('/chat/start', {});
      sid.current = j.sessionId;
      push({ from: 'bot', reply: j.reply });
    } catch {
      setErr('The assistant is offline right now. Please make sure the server is running and try again.');
    }
    setBusy(false);
  };

  useEffect(() => {
    const f = () => setOpen(true);
    window.addEventListener('vertexx:chat', f);
    return () => window.removeEventListener('vertexx:chat', f);
  }, []);
  useEffect(() => { if (open && !sid.current && !busy) start(); }, [open]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [msgs, busy, err]);

  const send = async (t) => {
    const v = (t ?? text).trim();
    if (!v || busy || !sid.current) return;
    setText(''); push({ from: 'user', reply: v }); setBusy(true); setErr('');
    try {
      const j = await post('/chat/message', { sessionId: sid.current, message: v });
      push({ from: 'bot', ...j });
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} aria-label="Open booking assistant"
        className="fixed right-4 z-50 flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-xl shadow-brand/30 transition hover:-translate-y-0.5"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
        <Icon size={20} d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
        Book with AI
      </button>
    );
  }

  const last = msgs.length - 1;
  return (
    <div role="dialog" aria-label="Vertexx booking assistant"
      className="fixed right-4 z-50 flex h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))', maxHeight: 'calc(100dvh - 2rem - env(safe-area-inset-top, 0px))' }}>
      <div className="flex items-center justify-between bg-gradient-to-br from-[#0a3a3e] to-[#0f5257] px-5 py-4 text-white">
        <div><b className="font-head text-lg">Vertexx assistant</b><p className="text-xs text-teal-100">Book products in a few steps</p></div>
        <button onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-full p-1.5 hover:bg-white/15"><Icon size={20} d="M6 6l12 12M18 6L6 18" /></button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === 'user' ? 'flex justify-end' : ''}>
            <div className={'max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ' + (m.from === 'user' ? 'bg-brand text-white' : 'bg-tint')}>{m.reply}</div>
            {m.products && (
              <div className="mt-2 space-y-2">
                {m.products.map((p) => (
                  <button key={p.slug} onClick={() => send(p.name)} disabled={busy || i !== last}
                    className="block w-full rounded-2xl border border-line p-3 text-left text-sm transition hover:bg-tint disabled:opacity-60">
                    <span className="text-xs font-semibold text-brand">{p.type}</span>
                    <b className="block font-head">{p.name}</b>
                    <span className="text-xs text-mut">From ₹{p.priceFromLakh} lakh, about {p.leadTimeWeeks} weeks</span>
                  </button>
                ))}
              </div>
            )}
            {m.booking && (
              <div className="mt-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
                <b>Booking {m.booking.bookingId}</b>
                <p>{m.booking.productName}, qty {m.booking.quantity}, {m.booking.preferredDate}</p>
              </div>
            )}
            {m.quick && i === last && !busy && (
              <div className="mt-2 flex flex-wrap gap-2">
                {m.quick.map((q) => <button key={q} onClick={() => send(q)} className="rounded-full border border-brand px-3 py-1 text-sm font-medium text-brand hover:bg-brand hover:text-white">{q}</button>)}
              </div>
            )}
          </div>
        ))}
        {busy && <p className="text-sm text-mut">Typing…</p>}
        {err && (
          <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600">
            {err} {!sid.current && <button className="font-semibold underline" onClick={start}>Retry</button>}
          </p>
        )}
        <div ref={end} />
      </div>
      <div className="flex gap-2 border-t border-line p-3">
        <label htmlFor="chat-input" className="sr-only">Your message</label>
        <input id="chat-input" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type your message" disabled={!sid.current}
          className="min-w-0 flex-1 rounded-full border border-line bg-bg px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sig" />
        <button onClick={() => send()} disabled={busy || !text.trim() || !sid.current} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Send</button>
      </div>
    </div>
  );
}
