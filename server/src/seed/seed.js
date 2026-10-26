import 'dotenv/config';
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import { Product, Knowledge } from '../models/index.js';

const read = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));

await connectDB();
for (const p of read('./products.json')) await Product.updateOne({ slug: p.slug }, { $set: { ...p, active: true } }, { upsert: true });
await Knowledge.deleteMany({});
await Knowledge.insertMany(read('./knowledge.json'));
console.log('Seeded products and knowledge base');
await mongoose.disconnect();
