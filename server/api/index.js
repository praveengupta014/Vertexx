import { app } from '../src/app.js';
import { connectDB } from '../src/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Serverless Handler] DB Error:', err.message);
  }
  return app(req, res);
}
