import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Dashboard() {
  const [interviewerName, setInterviewerName] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();

  const createSession = async () => {
    const response = await fetch(`${API_BASE_URL}/session/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interviewerName,
        candidateName,
        scheduledTime: new Date().toISOString()
      })
    });

    const data = await response.json();
    setSessionId(data.sessionId);
    localStorage.setItem('interviewerName', interviewerName);
    localStorage.setItem('candidateName', candidateName);
  };

  const handleJoinAsInterviewer = () => {
    navigate(`/interview/${sessionId}`);
  };

  return (
    <div className="container">
      <h2>Create Interview Session</h2>
      <input
        type="text"
        placeholder="Interviewer Name"
        value={interviewerName}
        onChange={e => setInterviewerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Candidate Name"
        value={candidateName}
        onChange={e => setCandidateName(e.target.value)}
      />
      <button onClick={createSession}>Generate Session</button>

      {sessionId && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Share this link with candidate:</strong></p>
          <code>https://200c5190-9526-41ac-8557-aa4fd1d7b772-00-3kqlw47x0r028.sisko.replit.dev/join/{sessionId}</code>
          <br />
          <button onClick={handleJoinAsInterviewer}>Start Interview as Interviewer</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
