import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const timestamps = { timestamps: true };

export const BOOKING_STATUS = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
export const LEAD_STATUS = ['new', 'contacted', 'proposal', 'won'];

export const Product = model('Product', new Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Service', 'Solution'], required: true },
  industries: [String],
  description: String,
  features: [String],
  priceFromLakh: { type: Number, required: true, min: 0 },
  leadTimeWeeks: { type: Number, default: 4, min: 0 },
  active: { type: Boolean, default: true },
}, timestamps));

// Company FAQ / policy text used by the RAG assistant.
export const Knowledge = model('Knowledge', new Schema({ title: String, text: String }, timestamps));

export const Customer = model('Customer', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: String,
  company: String,
}, timestamps));

export const Booking = model('Booking', new Schema({
  bookingId: { type: String, unique: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  quantity: { type: Number, required: true, min: 1 },
  preferredDate: { type: Date, required: true },
  notes: String,
  estimatedLakh: Number,
  source: { type: String, enum: ['ai-chat', 'api', 'web'], default: 'api' },
  status: { type: String, enum: BOOKING_STATUS, default: 'pending' },
}, timestamps));

export const Lead = model('Lead', new Schema({
  leadId: { type: String, unique: true },
  name: { type: String, required: true },
  company: String,
  email: { type: String, required: true, lowercase: true },
  phone: String,
  items: [String],
  industry: String,
  budget: String,
  timeline: String,
  mode: String,
  status: { type: String, enum: LEAD_STATUS, default: 'new' },
}, timestamps));

export const Contact = model('Contact', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  message: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, timestamps));

export const ChatSession = model('ChatSession', new Schema({
  sid: { type: String, required: true, unique: true },
  stage: { type: String, default: 'name' },
  data: { type: Schema.Types.Mixed, default: {} },
  messages: [{ role: String, text: String, at: { type: Date, default: Date.now } }],
  bookingId: String,
}, { ...timestamps, minimize: false }));

const Counter = model('Counter', new Schema({ _id: String, seq: { type: Number, default: 0 } }));
export const nextSeq = async (key, base = 1000) =>
  (await Counter.findOneAndUpdate({ _id: key }, { $inc: { seq: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true })).seq + base;
