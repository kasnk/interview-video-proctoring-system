import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session.js';

export const createSession = async (req, res) => {
  try {
    const { interviewerName, candidateName, scheduledTime } = req.body;
    const sessionId = uuidv4();

    const session = new Session({ interviewerName, candidateName, scheduledTime, sessionId });
    await session.save();

    res.status(201).json({ sessionId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' });
  }
};
