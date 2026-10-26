import { useState, Fragment } from 'react';
import { POSTS } from '../data/catalog';
import { Card, chip, link, PH, Sec } from '../ui';

export function News({ id }) {
  const [cat, setCat] = useState('All');
  const p = POSTS.find(x => x.id === id);
  if (id && p) return (<Fragment><PH t={p.t} s={p.c + ', ' + p.d + ', ' + p.r + ' min read'}/><Sec><article className="max-w-3xl space-y-5 text-lg text-mut">{p.b.map((t, i) => (<p key={i}>{t}</p>))}</article><a href="#/news" className={link + ' mt-8 inline-block'}>← All news</a></Sec><Sec t="Keep reading" tint><div className="grid gap-6 md:grid-cols-3">{POSTS.filter(x => x.id !== id).slice(0, 3).map(x => (<a key={x.id} href={'#/news/' + x.id} className={Card + ' transition hover:-translate-y-1 hover:shadow-xl'}><span className="text-xs font-semibold text-brand">{x.c}</span><h3 className="mt-2 font-head text-lg font-bold">{x.t}</h3></a>))}</div></Sec></Fragment>);
  const cats = ['All', ...new Set(POSTS.map(x => x.c))];
  return (<Fragment><PH t="News and blog" s="Company updates, case studies and practical insights for operations teams."/><Sec><div className="mb-8 flex flex-wrap gap-2">{cats.map(c => (<button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{c}</button>))}</div><div className="grid gap-6 md:grid-cols-2">{POSTS.filter(x => cat === 'All' || x.c === cat).map(x => (<a key={x.id} href={'#/news/' + x.id} className={Card + ' transition hover:-translate-y-1 hover:shadow-xl'}><span className="text-xs font-semibold text-brand">{x.c}, {x.d}</span><h3 className="mt-2 font-head text-xl font-bold">{x.t}</h3><p className="mt-2 text-mut">{x.x}</p><span className={link + ' mt-4 inline-block'}>Read article ({x.r} min)</span></a>))}</div></Sec></Fragment>);
}
