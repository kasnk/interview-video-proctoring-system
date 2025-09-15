import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  interviewerName: String,
  candidateName: String,
  scheduledTime: Date,
  sessionId: { type: String, unique: true },
  isActive: { type: Boolean, default: false }
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
