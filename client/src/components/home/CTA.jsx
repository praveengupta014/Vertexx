import { useState } from 'react';
import { btn } from '../../ui';

export function CTA() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (<section id="contact" className="px-5 py-20 sm:px-8"><div className="mx-auto grid max-w-6xl items-center gap-10 rounded-[2rem] bg-gradient-to-br from-[#0a3a3e] to-[#0f5257] p-8 text-white shadow-2xl sm:p-14 lg:grid-cols-[1.2fr_1fr]">
    <div><h2 className="font-head text-4xl font-bold tracking-tight sm:text-5xl">Tell us where your operation slows down</h2><p className="mt-4 text-teal-100">Share your email and an engineer will reply within one working day.</p></div>
    {sent ? (<p role="status" className="font-semibold text-sig">Thanks. We will write to {email} within one working day.</p>)
      : (<div className="flex flex-col gap-3 sm:flex-row"><label htmlFor="em" className="sr-only">Work email</label>
        <input id="em" type="email" placeholder="Work email" value={email} onChange={e => setEmail(e.target.value)} className="min-w-0 flex-1 rounded-full px-5 py-3 text-[#10231f] outline-none focus-visible:ring-4 focus-visible:ring-sig"/>
        <button onClick={() => /\S+@\S+\.\S+/.test(email) ? setSent(true) : document.getElementById('em').focus()} className={btn + ' bg-sig text-[#10231f] hover:brightness-110'}>Request a call</button></div>)}
  </div></section>);
}
