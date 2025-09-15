import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function ReportPage() {
  const { sessionId } = useParams();
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const response = await fetch(`${API_BASE_URL}/report/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: localStorage.getItem('candidateName') || 'Candidate',
          sessionId,
          logs: [] // Optional: could fetch logs from backend if stored
        })
      });

      const data = await response.json();
      setScore(data.score);
    };

    fetchReport();
  }, [sessionId]);

  return (
    <div className="container">
      <h2>Proctoring Report</h2>
      {score !== null ? (
        <>
          <p><strong>Integrity Score:</strong> {score}</p>
          <a
            href={`https://200c5190-9526-41ac-8557-aa4fd1d7b772-00-3kqlw47x0r028.sisko.replit.dev:3001/reports/${sessionId}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Download PDF Report</button>
          </a>
        </>
      ) : (
        <p>Generating report...</p>
      )}
    </div>
  );
}

export default ReportPage;
