import { useState } from 'react';
import { Icon, wrap, btn } from '../ui';
import { NAV } from '../data/catalog';

export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const toggle = () => { const n = !dark; setDark(n); document.documentElement.dataset.theme = n ? 'dark' : 'light'; };
  return (<header className="sticky z-50 border-b border-line bg-bg/85 backdrop-blur-md" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
    <div className={wrap + ' flex h-[68px] items-center justify-between'}>
      <a href="#/" className="font-head text-2xl font-extrabold tracking-tight">Vertexx</a>
      <nav aria-label="Main" className={(open ? 'flex' : 'hidden') + ' absolute left-0 right-0 top-[68px] flex-col gap-1 border-b border-line bg-bg px-5 pb-5 pt-2 lg:static lg:flex lg:flex-row lg:items-center lg:gap-7 lg:border-0 lg:bg-transparent lg:p-0'}>
        {NAV.map(([l, id]) => (<a key={id} href={'#/' + id} onClick={() => setOpen(false)} className="py-2 font-medium text-mut transition hover:text-brand">{l}</a>))}
        <button onClick={toggle} aria-label="Switch light or dark theme" className="self-start rounded-full border border-line p-2 text-mut hover:text-brand md:self-auto">
          <Icon size={18} d={dark ? 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6 6L4.5 4.5M19.5 19.5L18 18M18 6l1.5-1.5M4.5 19.5L6 18M12 8a4 4 0 100 8 4 4 0 000-8z' : 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z'}/>
        </button>
        <a href="#/inquiry" className={btn + ' bg-brand text-white hover:opacity-90 py-2'}>Get a quote</a>
      </nav>
      <button className="p-2 lg:hidden" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}><Icon d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}/></button>
    </div>
  </header>);
}

export default Header;
