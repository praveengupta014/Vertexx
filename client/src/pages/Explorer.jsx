import { useState, Fragment } from 'react';
import { CAT, IND, byId } from '../data/catalog';
import { track } from '../store';
import { Card, chip, inp, link, PH, Sec } from '../ui';

export function Explorer() {
  const [q, setQ] = useState(''), [type, setType] = useState('All'), [ind, setInd] = useState('All'), [sort, setSort] = useState('name'), [cmp, setCmp] = useState([]);
  const list = CAT.filter(c => (type === 'All' || c.type === type) && (ind === 'All' || c.inds.map(i => IND[i]).includes(ind)) && (c.n + c.x).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'name' ? a.n.localeCompare(b.n) : sort === 'price' ? a.p - b.p : a.wk - b.wk);
  const pick = v => { setInd(v); if (v !== 'All') track('industry', v); };
  const tog = id => setCmp(c => c.includes(id) ? c.filter(x => x !== id) : c.length < 3 ? [...c, id] : c);
  const rows = [['Type', c => c.type], ['Starting price', c => '₹' + c.p + ' lakh'], ['Timeline', c => c.wk + ' weeks'], ['Industries', c => c.inds.map(i => IND[i]).join(', ')], ['Key features', c => c.f.join(', ')]];
  const sel = cmp.map(byId);
  return (<Fragment><PH t="Services and solutions" s="Search, filter by industry, sort and compare everything we offer."/>
  <Sec>
    <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
      <input aria-label="Search" placeholder="Search services and solutions" value={q} onChange={e => setQ(e.target.value)} className={inp}/>
      <select aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)} className={inp}><option value="name">Sort: Name</option><option value="price">Sort: Price, low to high</option><option value="wk">Sort: Shortest timeline</option></select>
    </div>
    <div className="mb-3 flex flex-wrap gap-2">{['All', 'Service', 'Solution'].map(t => (<button key={t} onClick={() => setType(t)} className={chip(type === t)}>{t === 'All' ? 'Everything' : t + 's'}</button>))}</div>
    <div className="mb-8 flex flex-wrap gap-2">{['All', ...IND].map(t => (<button key={t} onClick={() => pick(t)} className={chip(ind === t)}>{t === 'All' ? 'All industries' : t}</button>))}</div>
    {list.length === 0 && (<p className="py-10 text-center text-mut">Nothing matches. <button className={link} onClick={() => { setQ(''); setType('All'); setInd('All'); }}>Clear filters</button></p>)}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map(c => (<article key={c.id} className={Card + ' flex flex-col transition hover:-translate-y-1 hover:shadow-xl'}>
      <div className="flex items-center justify-between"><span className={'rounded-full px-3 py-1 text-xs font-semibold ' + (c.type === 'Service' ? 'bg-tint text-brand' : 'bg-sig/25')}>{c.type}</span><label className="flex items-center gap-2 text-sm text-mut"><input type="checkbox" checked={cmp.includes(c.id)} onChange={() => tog(c.id)}/>Compare</label></div>
      <h3 className="mt-4 font-head text-xl font-bold">{c.n}</h3><p className="mt-2 text-mut">{c.x}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">{c.inds.map(i => (<span key={i} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-mut">{IND[i]}</span>))}</div>
      <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-sm" style={{ marginTop: '1.25rem' }}><span>From <b>₹{c.p} lakh</b>, {c.wk} weeks</span><a href={'#/services/' + c.id} className={link}>Details</a></div>
    </article>))}</div>
  </Sec>
  <Sec t="Compare services" tint>
    {sel.length < 2 ? (<p className="text-mut">Tick Compare on two or three cards to see them side by side.</p>) : (<div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr><th className="p-3"></th>{sel.map(c => (<th key={c.id} className="p-3 font-head text-lg">{c.n}</th>))}</tr></thead><tbody>{rows.map(([l, fn]) => (<tr key={l} className="border-t border-line align-top"><td className="p-3 font-semibold">{l}</td>{sel.map(c => (<td key={c.id} className="p-3 text-mut">{fn(c)}</td>))}</tr>))}</tbody></table></div>)}
  </Sec></Fragment>);
}
