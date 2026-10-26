import mongoose from 'mongoose';
import { Product, Customer, Booking, nextSeq } from '../models/index.js';
import { httpError } from '../middleware.js';

const EMAIL = /^\S+@\S+\.\S+$/;

// Single place where a booking is created. Used by the REST API and by the AI chat.
export async function createBooking({ customer = {}, productId, quantity, preferredDate, notes = '', source = 'api' }) {
  const name = String(customer.name || '').trim();
  const email = String(customer.email || '').trim().toLowerCase();
  if (!name || !EMAIL.test(email)) throw httpError(400, 'Customer name and a valid email are required');

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 1000) throw httpError(400, 'Quantity must be a whole number between 1 and 1000');

  const date = new Date(preferredDate);
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  if (Number.isNaN(date.getTime()) || date < todayUtc) throw httpError(400, 'Preferred date must be today or later');

  const key = String(productId || '');
  const product = mongoose.isValidObjectId(key) ? await Product.findById(key) : await Product.findOne({ slug: key });
  if (!product || !product.active) throw httpError(404, 'Product not found');

  const cust = await Customer.findOneAndUpdate(
    { email },
    { $set: { name, phone: customer.phone || '', company: customer.company || '' } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  return Booking.create({
    bookingId: 'VTX-' + (await nextSeq('booking')),
    customer: cust._id,
    product: product._id,
    productName: product.name,
    quantity: qty,
    preferredDate: date,
    notes: String(notes).slice(0, 500),
    estimatedLakh: Math.round(product.priceFromLakh * qty * 100) / 100,
    source,
  });
}
