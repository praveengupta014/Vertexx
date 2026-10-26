export const Icon = ({ d, size = 24 }) => (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d}/></svg>);

export const wrap = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export const btn = 'inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sig';

export const Card = 'rounded-3xl border border-line bg-surface p-6';

export const chip = on => 'rounded-full border px-4 py-1.5 text-sm font-medium transition ' + (on ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-mut hover:text-brand');

export const inp = 'w-full rounded-xl border border-line bg-bg px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-sig';

export const link = 'font-semibold text-brand underline underline-offset-4';

export const PH = ({ t, s }) => (<section className="grain relative overflow-hidden border-b border-line"><div className={wrap + ' py-14 md:py-20'}><h1 className="rise max-w-3xl font-head text-4xl font-extrabold tracking-tight sm:text-6xl">{t}</h1><p className="mt-4 max-w-2xl text-lg text-mut">{s}</p></div></section>);

export const Sec = ({ t, tint, children }) => (<section className={'py-14 ' + (tint ? 'bg-tint' : '')}><div className={wrap}>{t && (<h2 className="mb-8 font-head text-3xl font-bold tracking-tight sm:text-4xl">{t}</h2>)}{children}</div></section>);

export const Bar = ({ l, v, max }) => (<div className="mb-3"><div className="mb-1 flex justify-between text-sm"><span>{l}</span><b>{v}</b></div><div className="h-2 rounded-full bg-tint"><div className="h-2 rounded-full bg-brand transition-all" style={{ width: (max ? v / max * 100 : 0) + '%' }}></div></div></div>);
