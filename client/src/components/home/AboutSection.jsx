import { wrap, Icon } from '../../ui';
import { HIGHLIGHTS } from '../../data/catalog';

export function AboutSection() {
  return (<section id="about" className="py-24">
    <div className={wrap}>
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <h2 className="max-w-md font-head text-4xl font-bold leading-tight tracking-tight sm:text-5xl">A partner for operations that cannot afford to stop</h2>
        <div className="space-y-4 text-lg text-mut"><p>Since 1998 we have helped companies replace manual, disconnected processes with systems their teams trust. Our engineers stay with a project from first survey to long-term support.</p><p>We measure ourselves on one thing: whether your operation performs better a year after we finish.</p></div>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {HIGHLIGHTS.map(([t, x, d]) => (<article key={t} className="rounded-3xl border border-line bg-surface p-7 transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-sig/20 text-brand"><Icon d={d}/></div><h3 className="font-head text-xl font-bold">{t}</h3><p className="mt-2 text-mut">{x}</p></article>))}
      </div>
    </div>
  </section>);
}
