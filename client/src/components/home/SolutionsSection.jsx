import { wrap } from '../../ui';
import { SOLUTIONS } from '../../data/catalog';

export function SolutionsSection() {
  return (<section id="solutions" className="py-24"><div className={wrap}>
    <h2 className="max-w-lg font-head text-4xl font-bold tracking-tight sm:text-5xl">Featured solutions</h2>
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {SOLUTIONS.map(([n, tag, x, r], k) => (<article key={n} className="flex flex-col rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:shadow-xl">
        <div className="mb-6 flex h-36 items-end gap-2 rounded-2xl bg-gradient-to-br from-[#0a3a3e] to-[#0f5257] p-4">{[45,70,55,85,65,95,80].map((h, j) => (<div key={j} className="flex-1 rounded-md bg-sig/90" style={{ height: ((h + k * 17 + j * 5) % 55 + 40) + '%' }}></div>))}</div>
        <span className="w-fit rounded-full bg-tint px-3 py-1 text-sm font-semibold text-brand">{tag}</span>
        <h3 className="mt-5 font-head text-2xl font-bold">{n}</h3><p className="mt-2 text-mut">{x}</p>
        <p className="mt-6 rounded-2xl bg-sig/20 px-4 py-3 font-semibold">{r}</p>
        <a href={'#/services/' + n.split(' ')[1].toLowerCase()} className="mt-6 pt-2 font-semibold text-brand underline underline-offset-4">View details</a>
      </article>))}
    </div>
  </div></section>);
}
