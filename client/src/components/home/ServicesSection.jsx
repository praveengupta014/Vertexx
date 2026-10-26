import { wrap, Icon } from '../../ui';
import { SERVICES } from '../../data/catalog';

export function ServicesSection() {
  return (<section id="services" className="bg-tint py-24"><div className={wrap}>
    <h2 className="max-w-lg font-head text-4xl font-bold tracking-tight sm:text-5xl">What we do for you</h2>
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map(([t, x, d], k) => (<article key={t} className={'group rounded-3xl bg-surface p-8 ring-1 ring-line transition hover:-translate-y-1 hover:bg-brand hover:text-white hover:shadow-2xl ' + (k % 3 === 0 ? 'lg:col-span-2' : '')}><div className="mb-5 text-brand group-hover:text-sig"><Icon size={30} d={d}/></div><h3 className="font-head text-xl font-bold">{t}</h3><p className="mt-2 text-mut group-hover:text-white/80">{x}</p></article>))}
    </div>
  </div></section>);
}
