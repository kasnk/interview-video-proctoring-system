import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session.js';

export const createSession = async (req, res) => {
  try {
    const { interviewerName, candidateName, scheduledTime } = req.body;
    const sessionId = uuidv4();

    console.log(`[Session] Creating session: ${sessionId}`);
    console.log(`[Session] Interviewer: ${interviewerName}, Candidate: ${candidateName}`);

    // Skip database save if MongoDB is not connected
    try {
      const session = new Session({ interviewerName, candidateName, scheduledTime, sessionId });
      await session.save();
      console.log(`[Session] Session saved to database`);
    } catch (dbError) {
      console.log(`[Session] Database save skipped - running without MongoDB`);
    }

    res.status(201).json({ sessionId });
  } catch (err) {
    console.error(`[Session] Error creating session:`, err);
    res.status(500).json({ error: 'Failed to create session' });
  }
};
