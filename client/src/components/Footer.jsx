import { wrap } from '../ui';

export function Footer() {
  const col = (t, items) => (<div><h4 className="mb-3 font-head font-bold text-white">{t}</h4>{items.map(([l, h]) => (<a key={l} href={h} className="mb-2 block hover:text-sig">{l}</a>))}</div>);
  return (<footer className="bg-[#0b1513] pt-14 text-slate-300"><div className={wrap + ' grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]'}>
    <div><a href="#/" className="font-head text-2xl font-extrabold text-white">Vertexx</a><p className="mt-3 max-w-xs text-sm">Automation systems for operations that cannot afford to stop.</p></div>
    {col('Company', [['About us', '#/about'], ['Leadership', '#/company'], ['Clients', '#/clients'], ['News', '#/news']])}
    {col('Offer', [['Services', '#/services'], ['Get a quote', '#/inquiry'], ['AI Insights', '#/insights']])}
    <div><h4 className="mb-3 font-head font-bold text-white">Reach us</h4><a href="mailto:praveengupta6452@gmail.com" className="mb-2 block break-all hover:text-sig">praveengupta6452@gmail.com</a><a href="tel:+919509108401" className="block hover:text-sig">+91 9509108401</a></div>
  </div><div className={wrap + ' mt-12 border-t border-white/10 py-6 text-sm'}>© {new Date().getFullYear()} Vertexx. All rights reserved.</div></footer>);
}

export default Footer;
