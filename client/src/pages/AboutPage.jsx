import { useState, Fragment } from 'react';
import { Card, inp, btn, PH, Sec } from '../ui';
import { sendContact } from '../api';

export function AboutPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');
  const [m, setM] = useState({ name: '', email: '', msg: '' });

  const ok = m.name.trim() && /\S+@\S+\.\S+/.test(m.email) && m.msg.trim();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!ok || sending) return;
    setSending(true);
    setErr('');
    try {
      await sendContact({
        name: m.name.trim(),
        email: m.email.trim(),
        message: m.msg.trim(),
      });
      setSent(true);
    } catch (error) {
      console.error('Contact submission error:', error);
      setErr(error.message || 'Failed to deliver message. Please contact directly at praveengupta6452@gmail.com');
    } finally {
      setSending(false);
    }
  };

  return (
    <Fragment>
      <PH t="About us and contact" s="Twenty-eight years of building systems that keep working. Talk to the people who build them."/>
      
      <Sec>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-lg text-mut">
            <p>Vertexx began in 1998 as a small Jaipur workshop fixing conveyor controls. Today we design, integrate and run automation for manufacturers, retailers, energy companies and logistics firms in 36 countries.</p>
            <p>We stay with every project from first survey to long-term support, and we measure ourselves on the results our clients see a year later.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
            {[['Accountable', 'One team owns the outcome.'], ['Practical', 'Plain plans, honest timelines.'], ['Lasting', 'Built to run for decades.']].map(([t, x]) => (
              <div key={t} className={Card + ' p-5'}>
                <b className="font-head text-lg">{t}</b>
                <p className="text-sm text-mut">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      <Sec t="Contact us" tint>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className={Card + ' space-y-4'}>
            <div>
              <p className="text-sm text-mut">Phone</p>
              <a className="font-head text-2xl font-bold hover:text-brand transition-colors" href="tel:+919509108401">+91 9509108401</a>
            </div>
            <div>
              <p className="text-sm text-mut">Email (Direct notifications)</p>
              <a className="font-head text-xl font-bold hover:text-brand break-all transition-colors" href="mailto:praveengupta6452@gmail.com">praveengupta6452@gmail.com</a>
            </div>
            <div>
              <p className="text-sm text-mut">Head office</p>
              <p className="font-semibold">Jaipur, Rajasthan, India</p>
            </div>
            <div>
              <p className="text-sm text-mut">Hours</p>
              <p className="font-semibold">Monday to Saturday, 9:30 am to 6:30 pm IST</p>
            </div>
          </div>

          <div className={Card}>
            {sent ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-2xl text-emerald-600">
                  ✓
                </div>
                <h3 className="font-head text-2xl font-bold text-ink">Notification Sent!</h3>
                <p className="text-sm text-mut max-w-sm mx-auto">
                  Thanks <b>{m.name}</b>. An instant notification has been dispatched to <b>praveengupta6452@gmail.com</b>. We will reply to <b>{m.email}</b> shortly.
                </p>
                <button
                  onClick={() => { setSent(false); setM({ name: '', email: '', msg: '' }); }}
                  className={btn + ' mt-4 border border-line hover:border-brand text-sm'}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {err && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-600">
                    {err}
                  </div>
                )}
                <label className="block text-sm font-medium">
                  Your name
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={m.name}
                    onChange={(e) => setM({ ...m, name: e.target.value })}
                    className={inp + ' mt-1'}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Email
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={m.email}
                    onChange={(e) => setM({ ...m, email: e.target.value })}
                    className={inp + ' mt-1'}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Message
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe your project, timeline, or query..."
                    value={m.msg}
                    onChange={(e) => setM({ ...m, msg: e.target.value })}
                    className={inp + ' mt-1'}
                  ></textarea>
                </label>
                <button
                  type="submit"
                  disabled={!ok || sending}
                  className={btn + ' w-full bg-brand text-white disabled:opacity-40 transition-all shadow-md hover:shadow-lg'}
                >
                  {sending ? 'Sending notification...' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </Sec>
    </Fragment>
  );
}
