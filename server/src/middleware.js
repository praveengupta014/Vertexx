export const httpError = (status, message) => Object.assign(new Error(message), { status });
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export const pick = (o, keys) => Object.fromEntries(keys.filter((k) => o && o[k] !== undefined).map((k) => [k, o[k]]));

export const admin = (req, res, next) => {
  const key = process.env.ADMIN_KEY;
  if (!key) return res.status(503).json({ error: 'ADMIN_KEY is not configured on the server' });
  if (req.get('x-admin-key') !== key) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

// Simple in-memory limiter (per IP). Use a shared store such as Redis if you run several instances.
export const rateLimit = (max = 60, windowMs = 60000) => {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const recent = (hits.get(req.ip) || []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(req.ip, recent);
    if (recent.length > max) return res.status(429).json({ error: 'Too many requests, please slow down' });
    next();
  };
};

export const notFound = (req, res) => res.status(404).json({ error: 'Not found' });
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || (['ValidationError', 'CastError'].includes(err.name) ? 400 : err.code === 11000 ? 409 : 500);
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Server error' : err.message });
};
