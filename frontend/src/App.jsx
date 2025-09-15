import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import JoinPage from './pages/JoinPage.jsx';
import InterviewPage from './pages/InterviewPage.jsx';
import ThankYou from './pages/ThankYou.jsx';
import ReportPage from './pages/ReportPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/join/:sessionId" element={<JoinPage />} />
        <Route path="/interview/:sessionId" element={<InterviewPage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/report/:sessionId" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
