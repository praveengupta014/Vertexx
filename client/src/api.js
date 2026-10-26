const API = import.meta.env.VITE_API_URL || '';

export async function post(path, body) {
  const res = await fetch(`${API}/api${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Sends the inquiry form to the backend. The page keeps working if the server is offline.
export const sendLead = (f, items) =>
  post('/inquiries', { name: f.name, company: f.co, email: f.email, phone: f.phone, items, industry: f.ind, budget: f.budget, timeline: f.time, mode: f.mode }).catch(() => {});

// Sends contact form to backend and triggers instant Gmail notification
export const sendContact = async (data) => {
  try {
    return await post('/contact', data);
  } catch (err) {
    console.warn('[Contact] Backend call failed, using direct notification fallback:', err);
    const res = await fetch('https://formsubmit.co/ajax/praveengupta6452@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `🚨 New Contact from ${data.name} (Vertexx)`,
        _replyto: data.email,
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });
    const result = await res.json().catch(() => ({}));
    return { ok: true, fallback: true, result };
  }
};
