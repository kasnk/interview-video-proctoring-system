import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SIGNALING_SERVER_URL, API_BASE_URL } from '../config';
import useMonitoring from '../hooks/useMonitoring';

const socket = io(SIGNALING_SERVER_URL);

function InterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const logRef = useMonitoring(localVideoRef, sessionId);
  const [role, setRole] = useState('candidate');

  useEffect(() => {
    const detectedRole = localStorage.getItem('interviewerName') ? 'interviewer' : 'candidate';
    setRole(detectedRole);
  }, []);

  useEffect(() => {
    const setupWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;

        peerConnection.current = new RTCPeerConnection();

        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

        peerConnection.current.ontrack = event => {
          const [remoteStream] = event.streams;
          remoteVideoRef.current.srcObject = remoteStream;
        };

        peerConnection.current.onicecandidate = event => {
          if (event.candidate) {
            socket.emit('ice-candidate', { candidate: event.candidate, sessionId });
          }
        };

        socket.once('offer', async ({ offer }) => {
          if (role === 'candidate') {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit('answer', { answer, sessionId });
          }
        });

        socket.once('answer', async ({ answer }) => {
          if (role === 'interviewer') {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        socket.on('ice-candidate', async ({ candidate }) => {
          try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.warn('Failed to add ICE candidate:', err);
          }
        });

        socket.on('session-ended', async () => {
  console.log(`[Interview] session-ended received for role: ${role}`);

  if (role === 'candidate') {
    const candidateName = localStorage.getItem('candidateName') || 'Candidate';
    const logs = logRef.current || [];

    console.log(`[Interview] Candidate sending logs on session-ended`, logs);

    try {
      await fetch(`${API_BASE_URL}/report/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateName, sessionId, logs })
      });
    } catch (err) {
      console.error(`[Interview] Failed to send logs on session-ended`, err);
    }

    navigate('/thank-you');
  } else {
    navigate(`/report/${sessionId}`);
  }
});



        if (role === 'interviewer') {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          socket.emit('offer', { offer, sessionId });
        }
      } catch (err) {
        console.error('WebRTC setup failed:', err);
      }
    };

    setupWebRTC();
  }, [role, sessionId, navigate]);

const handleEndInterview = async () => {
  const candidateName = localStorage.getItem('candidateName') || 'Candidate';
  const logs = logRef.current || [];

  console.log(`[Interview] Ending session for role: ${role}`);
  console.log(`[Interview] Candidate name: ${candidateName}`);
  console.log(`[Interview] Logs collected:`, logs);

  // ✅ Stop camera
  if (localVideoRef.current?.srcObject) {
    localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    localVideoRef.current.srcObject = null;
    console.log(`[Interview] Camera stopped successfully`);
  } else {
    console.warn(`[Interview] No camera stream to stop`);
  }

  // ✅ Candidate sends logs before redirect
  if (role === 'candidate') {
    try {
      console.log(`[Interview] Sending logs to backend...`);
      const response = await fetch(`${API_BASE_URL}/report/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateName, sessionId, logs })
      });

      const result = await response.json();
      console.log(`[Interview] Backend response:`, result);
    } catch (err) {
      console.error(`[Interview] Report generation failed:`, err);
    }
  }

  // ✅ Notify both peers
  socket.emit('session-ended', sessionId);
  console.log(`[Interview] session-ended emitted for session: ${sessionId}`);

  // ✅ Redirect
  if (role === 'interviewer') {
    console.log(`[Interview] Redirecting to report page`);
    navigate(`/report/${sessionId}`);
  } else {
    console.log(`[Interview] Redirecting to thank-you page`);
    navigate('/thank-you');
  }
};

  return (
    <div className="container">
      <h2>Interview Session</h2>
      <div className="video-wrapper">
        <video ref={localVideoRef} autoPlay muted playsInline width="300" />
        <video ref={remoteVideoRef} autoPlay playsInline width="300" />
      </div>
      <button onClick={handleEndInterview}>End Interview</button>
    </div>
  );
}

export default InterviewPage;
