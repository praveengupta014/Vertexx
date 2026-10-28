import 'dotenv/config';
import { app } from '../server/src/app.js';
import { connectDB } from '../server/src/db.js';

// Connect DB via middleware before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Vercel Serverless] DB connection error:', err.message);
  }
  next();
});

export default app;
