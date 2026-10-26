import { wrap, btn } from '../../ui';

export function Hero() {
  return (<section id="top" className="grain relative overflow-hidden"><div className="gridbg pointer-events-none absolute inset-0 opacity-50"></div>
    <div className={wrap + ' relative grid items-center gap-14 py-20 md:py-28 lg:grid-cols-[1.15fr_1fr]'}>
      <div className="rise">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-sm font-medium text-mut backdrop-blur"><span className="h-2 w-2 rounded-full bg-emerald-500"></span>Trusted by 450+ operations worldwide</span>
        <h1 className="mt-6 bg-gradient-to-br from-ink via-ink to-brand bg-clip-text pb-2 font-head text-5xl font-extrabold leading-[1.05] tracking-tight text-transparent sm:text-6xl lg:text-7xl">Operations that run smoother, cost less and scale further.</h1>
        <p className="mt-6 max-w-xl text-lg text-mut">Vertexx designs, integrates and runs automation systems for manufacturers, retailers and logistics companies.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#/inquiry" className={btn + ' bg-brand text-white shadow-lg shadow-brand/30 hover:-translate-y-0.5'}>Book a consultation</a>
          <a href="#/services" className={btn + ' border border-line bg-surface/70 hover:bg-surface'}>See our solutions</a>
        </div>
      </div>
      <div className="rise relative" style={{ animationDelay: '.15s' }}>
        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sig/40 to-brand/30 blur-2xl"></div>
        <div className="float absolute -left-4 top-10 z-10 hidden items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-xl ring-1 ring-line sm:flex"><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 font-bold text-emerald-600">✓</span><span className="text-sm"><b>Zero downtime</b><br/><span className="text-mut">last 90 days</span></span></div>
        <div className="float absolute -bottom-6 right-4 z-10 rounded-2xl bg-sig px-4 py-3 text-sm font-semibold text-[#10231f] shadow-xl" style={{ animationDelay: '1.5s' }}>17% lower energy cost</div>
        <div className="relative rounded-3xl border border-white/10 bg-[#0a3a3e] p-7 text-white shadow-2xl">
          <div className="mb-6 flex items-center justify-between"><span className="font-head text-lg font-bold">Network status</span><span className="flex items-center gap-2 text-sm text-teal-100"><span className="h-2 w-2 rounded-full bg-emerald-400"></span>All sites running</span></div>
          {[['Jaipur hub',92],['Rotterdam port',78],['Pune plant',85]].map(([s, p]) => (<div key={s} className="mb-5"><div className="mb-1.5 flex justify-between text-sm"><span>{s}</span><b>{p}%</b></div><div className="h-2 rounded-full bg-white/15"><div className="grow h-2 rounded-full bg-sig" style={{ width: p + '%' }}></div></div></div>))}
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/10 p-4 text-sm"><span className="text-teal-100">Orders shipped today</span><b className="font-head text-2xl">12,480</b></div>
        </div>
      </div>
    </div>
  </section>);
}
