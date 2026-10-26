import { sendLead } from '../api.js';
import { useState, useEffect, Fragment } from 'react';
import { CAT, IND, byId, STAGES } from '../data/catalog';
import { track, DRAFT, LEADS } from '../store';
import { Card, inp, btn, PH, Sec } from '../ui';

export function Inquiry() {
  const d = DRAFT.use(), leads = LEADS.use();
  const [step, setStep] = useState(0), [done, setDone] = useState(null);
  const [f, setF] = useState({ ind: 'Manufacturing', budget: '₹10–25 lakh', time: '1–3 months', mode: 'Consultation call', name: '', co: '', email: '', phone: '' });
  useEffect(() => { track('inquiry'); }, []);
  const s = k => e => setF({ ...f, [k]: e.target.value });
  const tg = id => DRAFT.set(x => ({ items: x.items.includes(id) ? x.items.filter(i => i !== id) : [...x.items, id] }));
  const ok = [d.items.length > 0, f.name.trim() && /\S+@\S+\.\S+/.test(f.email), true][step];
  const submit = () => { const l = { id: 'HL-' + (1001 + leads.length), name: f.name, co: f.co || 'Individual', items: d.items, budget: f.budget, st: 0 }; LEADS.set(x => [...x, l]); track('inquiry'); sendLead(f, d.items); setDone(l); DRAFT.set({ items: [] }); };
  const sel = (k, o) => (<select value={f[k]} onChange={s(k)} className={inp}>{o.map(x => (<option key={x}>{x}</option>))}</select>);
  const lab = (t, el) => (<label className="block text-sm font-medium">{t}<div className="mt-1">{el}</div></label>);
  const names = d.items.map(i => byId(i).n).join(', ');
  return (<Fragment><PH t="Business inquiry" s="Tell us what you need. We will reply within one working day."/>
  <Sec>{done ? (<div className={Card + ' mx-auto max-w-2xl text-center'}><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-3xl text-emerald-600">✓</div><h2 className="mt-4 font-head text-3xl font-bold">Inquiry received</h2><p className="mt-2 text-mut">Reference <b>{done.id}</b>. An engineer will contact {done.name} at {f.email} within one working day for your {f.mode.toLowerCase()}.</p><button onClick={() => { setDone(null); setStep(0); }} className={btn + ' mt-6 bg-brand text-white'}>Send another inquiry</button></div>) : (<div className={Card + ' mx-auto max-w-3xl'}>
    <ol className="mb-8 flex gap-2">{['Requirements', 'Details', 'Summary'].map((t, i) => (<li key={t} className={'flex-1 border-t-4 pt-2 text-sm font-semibold ' + (i <= step ? 'border-brand text-brand' : 'border-line text-mut')}>{t}</li>))}</ol>
    {step === 0 && (<div><p className="mb-3 font-medium">What do you need? Pick one or more.</p><div className="grid gap-3 sm:grid-cols-2">{CAT.map(c => (<label key={c.id} className={'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ' + (d.items.includes(c.id) ? 'border-brand bg-tint' : 'border-line')}><input type="checkbox" checked={d.items.includes(c.id)} onChange={() => tg(c.id)}/><span><b>{c.n}</b><br/><span className="text-xs text-mut">{c.type}</span></span></label>))}</div><div className="mt-5">{lab('Your industry', sel('ind', IND))}</div></div>)}
    {step === 1 && (<div className="grid gap-4 sm:grid-cols-2">{lab('Budget', sel('budget', ['Under ₹10 lakh', '₹10–25 lakh', '₹25–50 lakh', '₹50 lakh+']))}{lab('Timeline', sel('time', ['Within 1 month', '1–3 months', '3–6 months', 'Flexible']))}{lab('Full name', (<input value={f.name} onChange={s('name')} className={inp}/>))}{lab('Company', (<input value={f.co} onChange={s('co')} className={inp}/>))}{lab('Work email', (<input type="email" value={f.email} onChange={s('email')} className={inp}/>))}{lab('Phone', (<input value={f.phone} onChange={s('phone')} className={inp}/>))}{lab('Consultation request', sel('mode', ['Consultation call', 'On-site visit', 'Video demo']))}</div>)}
    {step === 2 && (<dl className="grid gap-3 text-sm sm:grid-cols-[140px_1fr]">{[['Requirements', names], ['Industry', f.ind], ['Budget', f.budget], ['Timeline', f.time], ['Contact', f.name + (f.co ? ', ' + f.co : '')], ['Email / phone', f.email + ' / ' + (f.phone || 'not given')], ['Consultation', f.mode]].map(([a, b]) => (<Fragment key={a}><dt className="font-semibold text-mut">{a}</dt><dd>{b}</dd></Fragment>))}</dl>)}
    <div className="mt-8 flex justify-between"><button disabled={step === 0} onClick={() => setStep(step - 1)} className={btn + ' border border-line disabled:opacity-40'}>Back</button>
    {step < 2 ? (<button disabled={!ok} onClick={() => setStep(step + 1)} className={btn + ' bg-brand text-white disabled:opacity-40'}>Next</button>) : (<button onClick={submit} className={btn + ' bg-sig text-[#10231f]'}>Submit inquiry</button>)}</div>
    {step === 1 && !ok && (<p className="mt-3 text-sm text-mut">Add your name and a valid email to continue.</p>)}
  </div>)}</Sec>
  <Sec t="Lead status" tint><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="text-mut"><tr><th className="p-3">Lead</th><th className="p-3">Interest</th><th className="p-3">Budget</th><th className="p-3">Pipeline</th><th className="p-3">Status</th></tr></thead><tbody>{leads.map(l => (<tr key={l.id} className="border-t border-line align-top"><td className="p-3"><b>{l.id}</b><br/>{l.name}, {l.co}</td><td className="p-3 text-mut">{l.items.map(i => byId(i).n).join(', ')}</td><td className="p-3">{l.budget}</td><td className="p-3"><div className="flex w-32 gap-1">{STAGES.map((x, i) => (<span key={x} className={'h-2 flex-1 rounded-full ' + (i <= l.st ? 'bg-brand' : 'bg-line')}></span>))}</div></td><td className="p-3"><select aria-label={'Status of ' + l.id} value={l.st} onChange={e => LEADS.set(x => x.map(y => y.id === l.id ? { ...y, st: +e.target.value } : y))} className={inp + ' !w-auto !py-1.5'}>{STAGES.map((x, i) => (<option key={x} value={i}>{x}</option>))}</select></td></tr>))}</tbody></table></div></Sec></Fragment>);
}
