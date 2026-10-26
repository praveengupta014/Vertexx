import { useState } from 'react';
import { wrap } from '../../ui';
import { QUOTES } from '../../data/catalog';

export function Testimonials() {
  const [i, setI] = useState(0);
  const [q, n, r] = QUOTES[i];
  return (<section className="bg-tint py-24"><div className={wrap + ' max-w-4xl'}>
    <blockquote key={i} className="rise rounded-[2rem] bg-surface p-8 shadow-xl ring-1 ring-line sm:p-12"><div className="mb-5 text-2xl tracking-widest text-sig" aria-label="5 out of 5 stars">★★★★★</div><p className="font-head text-2xl font-medium leading-snug sm:text-3xl">“{q}”</p>
      <footer className="mt-7 flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-brand font-bold text-white">{n[0]}</span><span><b>{n}</b><br/><span className="text-mut">{r}</span></span></footer></blockquote>
    <div className="mt-8 flex gap-2.5" role="tablist" aria-label="Choose testimonial">
      {QUOTES.map((x, k) => (<button key={k} role="tab" aria-selected={k === i} aria-label={'Testimonial from ' + x[1]} onClick={() => setI(k)} className={'h-1.5 rounded-full transition-all ' + (k === i ? 'w-12 bg-brand' : 'w-8 bg-line')}></button>))}
    </div>
  </div></section>);
}
