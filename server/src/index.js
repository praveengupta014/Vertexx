import 'dotenv/config';
import { app } from './app.js';
import { connectDB } from './db.js';

const port = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(port, () => console.log(`Vertexx API running on http://localhost:${port}`)))
  .catch((e) => { console.error('Could not start server:', e.message); process.exit(1); });
