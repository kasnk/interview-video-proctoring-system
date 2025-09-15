import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri && mongoUri !== 'optional') {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected successfully');
    } else {
      console.log('MongoDB connection skipped - running without database');
    }
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    console.log('Continuing without database connection...');
  }
};

export default connectDB;
