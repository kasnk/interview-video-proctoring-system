import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log(`[Database] Attempting MongoDB connection...`);
    
    if (mongoUri && mongoUri !== 'optional') {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`[Database] MongoDB Atlas connected successfully`);
    } else {
      console.log(`[Database] MongoDB connection skipped - running without database`);
    }
  } catch (err) {
    console.error(`[Database] MongoDB connection failed:`, err);
    console.log(`[Database] Continuing without database connection...`);
  }
};

export default connectDB;
