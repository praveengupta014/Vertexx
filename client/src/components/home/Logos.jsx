export function Logos() {
  const names = ['Karna Foods','Nordvik Steel','Jaipur Logistics','Bluefin Retail','Orbis Energy','Apex Auto','Sahyadri Pharma'];
  return (<section aria-label="Our clients" className="overflow-hidden border-y border-line bg-surface/60 py-7"><p className="mb-5 text-center text-sm font-medium text-mut">Trusted by operations teams at</p><div className="marquee flex w-max gap-14 pr-14">{[...names, ...names].map((n, k) => (<span key={k} className="whitespace-nowrap font-head text-xl font-bold text-mut/70">{n}</span>))}</div></section>);
}
