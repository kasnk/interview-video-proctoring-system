import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function JoinPage() {
  const { sessionId } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    localStorage.setItem('candidateName', name);
    navigate(`/interview/${sessionId}`);
  };

  return (
    <div className="container">
      <h2>Join Interview</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}

export default JoinPage;
