Remote Interview & Proctoring Platform

A full-stack, real-time interview platform with integrated candidate monitoring, scoring, and reporting. Designed for fairness, transparency, and reliability in remote hiring workflows.

Features

Real-time video interview using WebRTC

Role-based session flow (Interviewer & Candidate)

Candidate monitoring via TensorFlow.js + MediaPipe

Event logging: focus loss, absence, multiple faces

Integrity scoring algorithm

PDF report generation

Socket-based signaling for peer connection

Modular architecture for scalability

Tech Stack

Frontend: React, WebRTC, Socket.IO Client Backend: Node.js, Express, Socket.IO Server Monitoring: TensorFlow.js, MediaPipe FaceMesh Database: MongoDB Atlas Reporting: PDFKit

Folder Structure

project-root/ 
├── client/ (React frontend) 
│ ├── pages/ 
│ ├── hooks/ 
│ ├── components/ 
│ └── config.js 
├── server/ (Express backend)
│ ├── controllers/ 
│ ├── routes/ 
│ ├── sockets/ 
│ └── app.js
├── reports/ (Generated PDF reports)
└── README.md

Setup Guide

Clone the repository git clone https://github.com/your-username/interview-proctoring-platform.git cd interview-proctoring-platform

Install dependencies Backend: cd server npm install

Frontend: cd ../client npm install

Configure environment Backend (.env): PORT=5000 MONGO_URI=your_mongodb_connection_string

Frontend (config.js): export const SIGNALING_SERVER_URL = 'http://localhost:5000'; export const API_BASE_URL = 'http://localhost:5000';

Start the application Backend: cd server npm start

Frontend: cd ../client npm start

Testing the Flow

Open two browser tabs

Tab A: Interviewer joins via /

Tab B: Candidate joins via /join/:sessionId

Conduct the interview

End the session

Candidate sends logs

Interviewer receives PDF report

Integrity Scoring Logic

Score = 100 - (focusLost × 2 + absence × 3 + suspicious × 5)

License

MIT License

Contact

Built by Shekhar For questions, reach out via GitHub or email

Let me know if you'd like me to generate a CONTRIBUTING guide, API reference, or deployment instructions next.
