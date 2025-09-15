# Remote Interview & Proctoring Platform

## Overview

A full-stack real-time interview and proctoring platform that enables remote hiring workflows with integrated candidate monitoring and automated reporting. The system supports WebRTC-based video interviews between interviewers and candidates, with AI-powered monitoring that tracks candidate behavior during interviews. Key features include real-time face detection, suspicious object identification, focus tracking, and automated integrity scoring with PDF report generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with Vite for fast development and modern tooling
- **Real-time Communication**: Socket.IO client for WebRTC signaling between peers
- **AI Monitoring**: TensorFlow.js with MediaPipe FaceMesh for client-side face detection and COCO-SSD for object detection
- **Role-based Flow**: Separate experiences for interviewers and candidates, with monitoring only active for candidates
- **State Management**: React hooks pattern with custom `useMonitoring` hook for AI detection logic

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework using ES modules
- **WebRTC Signaling**: Socket.IO server handling peer connection establishment (offer/answer/ICE candidates)
- **Session Management**: UUID-based session creation and tracking
- **Report Generation**: PDFKit for automated integrity report creation
- **API Design**: RESTful routes for session creation and report generation
- **File Serving**: Static file serving for generated PDF reports

### Data Storage Solutions
- **Primary Database**: MongoDB Atlas with Mongoose ODM for session storage
- **Graceful Degradation**: System continues operating without database connection for development/testing
- **File Storage**: Local filesystem for PDF report storage in `/reports` directory
- **Session State**: In-memory socket session tracking with room-based organization

### Authentication and Authorization
- **Simple Role System**: Role-based access using localStorage for candidate identification
- **Session-based Access**: UUID session IDs for secure interview room access
- **No Complex Auth**: Minimal authentication suitable for controlled interview environments

### AI Monitoring System
- **Face Detection**: MediaPipe FaceMesh for detecting presence and counting faces
- **Object Detection**: COCO-SSD for identifying suspicious objects during interviews
- **Event Logging**: Real-time tracking of focus loss, user absence, multiple faces, and suspicious objects
- **Integrity Scoring**: Weighted algorithm calculating candidate behavior score based on detected events

## External Dependencies

### Core Technologies
- **TensorFlow.js**: Client-side machine learning for face and object detection
- **MediaPipe FaceMesh**: Google's face landmark detection model
- **COCO-SSD**: Common Objects in Context model for object detection
- **Socket.IO**: Real-time bidirectional communication for WebRTC signaling
- **PDFKit**: PDF generation library for interview reports

### Database Services
- **MongoDB Atlas**: Cloud-hosted MongoDB for session and report storage
- **Mongoose**: MongoDB ODM for schema definition and data modeling

### Development Tools
- **Vite**: Frontend build tool with hot module replacement
- **Nodemon**: Backend development server with auto-restart
- **ESLint**: Code linting for React and JavaScript best practices

### WebRTC Infrastructure
- **Native WebRTC APIs**: Browser-based peer-to-peer video communication
- **STUN/TURN Support**: Configurable for NAT traversal in production environments

### Deployment Considerations
- **Replit Integration**: Configured for Replit's hosting environment with dynamic URLs
- **CORS Configuration**: Permissive CORS setup for development (needs tightening for production)
- **Port Management**: Frontend (5000) and Backend (3001) with configurable endpoints