import mongoose from 'mongoose';

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vertexx';
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log('MongoDB connected');
  return mongoose.connection;
}
