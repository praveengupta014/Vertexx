import { Fragment } from 'react';
import { CAT, IND, SEED } from '../data/catalog';
import { EV, track } from '../store';
import { Card, chip, btn, PH, Sec, Bar } from '../ui';

export function Insights() {
  const evs = EV.use();
  const by = t => evs.filter(e => e[0] === t).reduce((m, e) => (m[e[1]] = (m[e[1]] || 0) + 1, m), {});
  const n = t => evs.filter(e => e[0] === t).length;
  const sv = by('service'), so = by('solution'), ic = by('industry');
  const aff = c => c.inds.reduce((s, i) => s + (ic[IND[i]] || 0), 0);
  const rank = CAT.map(c => ({ c, s: (sv[c.id] || 0) * 2 + (so[c.id] || 0) * 3 + aff(c) * 1.5 })).sort((a, b) => b.s - a.s);
  const inds = IND.map(i => [i, ic[i] || 0]).sort((a, b) => b[1] - a[1]);
  const top = inds[0][1] ? inds[0][0] : 'general automation';
  const freq = CAT.filter(c => sv[c.id]).sort((a, b) => sv[b.id] - sv[a.id]);
  const sc = {}; CAT.filter(c => so[c.id]).forEach(c => c.inds.forEach(i => sc[IND[i]] = (sc[IND[i]] || 0) + so[c.id]));
  const st = [['Website Visit', 'visit'], ['Service View', 'service'], ['Solution Explore', 'solution'], ['Industry Visit', 'industry'], ['Company Profile View', 'company'], ['Inquiry Intent', 'inquiry']];
  const reached = st.filter(x => n(x[1])).length;
  const intent = Math.min(100, Math.round(reached / 6 * 60 + Math.min(n('inquiry'), 2) * 20));
  const lvl = intent < 40 ? 'Low' : intent < 75 ? 'Medium' : 'High';
  const why = r => (sv[r.c.id] || so[r.c.id]) ? 'You explored this' : aff(r.c) ? 'Fits your ' + top + ' interest' : 'Popular with visitors';
  const rec = t => rank.filter(r => r.c.type === t).slice(0, 3);
  const recCard = r => (<a key={r.c.id} href={'#/services/' + r.c.id} className="block rounded-2xl border border-line p-4 transition hover:bg-tint"><b>{r.c.n}</b><p className="text-sm text-mut">{why(r)}</p></a>);
  const simulate = () => [['service', 'analytics'], ['solution', 'flow'], ['solution', 'trace'], ['industry', 'Retail'], ['company'], ['inquiry']].forEach(e => track(e[0], e[1]));
  const emp = t => (<p className="text-sm text-mut">{t}</p>);
  return (<Fragment><PH t="Visitor behaviour and recommendations" s="A live view of how a visitor moves through the site, with suggestions based on what they explore."/>
  <Sec><div className="mb-6 flex flex-wrap items-center gap-3"><button onClick={simulate} className={btn + ' bg-brand text-white'}>Simulate a visitor journey</button><button onClick={() => EV.set(SEED)} className={btn + ' border border-line'}>Reset data</button><span className="text-sm text-mut">Your own clicks around this site are tracked here too.</span></div>
  <div className="grid gap-6 lg:grid-cols-3">
    <div className={Card + ' lg:col-span-2'}><h2 className="mb-4 font-head text-xl font-bold">Visitor journey</h2><div className="flex flex-wrap items-center gap-2">{st.map(([l, k], i) => (<Fragment key={k}><div className={'rounded-2xl border px-3 py-2 text-sm ' + (n(k) ? 'border-brand bg-tint font-semibold' : 'border-line text-mut')}>{l}<br/><b className="font-head text-lg">{n(k)}</b></div>{i < 5 && (<span className="text-mut">→</span>)}</Fragment>))}</div></div>
    <div className={Card}><h2 className="font-head text-xl font-bold">Inquiry-interest indicator</h2><p className="mt-3 font-head text-5xl font-extrabold">{intent}<span className="text-xl text-mut">/100</span></p><div className="mt-3 h-3 rounded-full bg-tint"><div className="h-3 rounded-full bg-gradient-to-r from-sig to-brand transition-all" style={{ width: intent + '%' }}></div></div><p className="mt-3 font-semibold">{lvl} intent</p></div>
    <div className={Card}><h2 className="mb-3 font-head text-xl font-bold">Business engagement summary</h2><p className="text-sm text-mut">{evs.length} interactions across {reached} of 6 journey stages. Strongest interest: <b className="text-ink">{top}</b>. Most viewed: <b className="text-ink">{rank[0].s ? rank[0].c.n : 'nothing yet'}</b>.</p></div>
    <div className={Card}><h2 className="mb-3 font-head text-xl font-bold">Visitor business interests</h2><div className="flex flex-wrap gap-2">{rank.filter(r => r.s > 0).slice(0, 4).map(r => (<span key={r.c.id} className={chip(true)}>{r.c.n}</span>))}{inds[0][1] > 0 && (<span className={chip(false)}>{top}</span>)}</div></div>
    <div className={Card}><h2 className="mb-3 font-head text-xl font-bold">Frequently viewed services</h2>{freq.length ? freq.map(c => (<Bar key={c.id} l={c.n} v={sv[c.id]} max={sv[freq[0].id]}/>)) : emp('No service views yet.')}</div>
    <div className={Card}><h2 className="mb-3 font-head text-xl font-bold">Industry-interest patterns</h2>{inds.map(([i, v]) => (<Bar key={i} l={i} v={v} max={inds[0][1]}/>))}</div>
    <div className={Card}><h2 className="mb-3 font-head text-xl font-bold">Preferred solution categories</h2>{Object.keys(sc).length ? Object.entries(sc).sort((a, b) => b[1] - a[1]).map(([i, v]) => (<Bar key={i} l={i} v={v} max={Math.max(...Object.values(sc))}/>)) : emp('Open a solution to see preferences.')}</div>
    <div className={Card}><h2 className="mb-3 font-head text-xl font-bold">Recommended services</h2><div className="space-y-3">{rec('Service').map(recCard)}</div></div>
    <div className={Card}><h2 className="mb-3 font-head text-xl font-bold">Suggested company solutions</h2><div className="space-y-3">{rec('Solution').map(recCard)}</div></div>
  </div></Sec></Fragment>);
}
