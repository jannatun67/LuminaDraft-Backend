import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  // Accept a full URI directly, or build from individual env vars
  const MONGODB_URI =
    process.env['MONGODB_URI'] ??
    (() => {
      const user    = process.env['MONGODB_USERNAME'];
      const pass    = process.env['MONGODB_PASSWORD'];
      const cluster = process.env['MONGODB_CLUSTER'];
      const db      = process.env['MONGODB_DB_NAME'] ?? '';
      if (!user || !pass || !cluster) {
        throw new Error('MongoDB connection details are missing from environment variables');
      }
      return `mongodb+srv://${user}:${pass}@${cluster}/${db}`;
    })();

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));
mongoose.connection.on('error', err => console.error('❌ MongoDB error:', err));

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
