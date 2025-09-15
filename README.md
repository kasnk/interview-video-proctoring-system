
# Interview Video Proctoring System

A real-time interview and proctoring platform designed to enhance remote hiring processes. This full-stack application utilizes WebRTC for video communication, TensorFlow.js and MediaPipe for candidate monitoring, and generates integrity scores and PDF reports to ensure fairness and transparency.

[![Project Status](https://img.shields.io/badge/status-active-success)](https://www.repostatus.org/#active)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)
[![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)

## Features

-   **Real-time Video Interview:** Utilizes WebRTC for low-latency, peer-to-peer video communication.
-   **Role-Based Session Flow:** Differentiates between interviewer and candidate roles for a structured interview process.
-   **Candidate Monitoring:** Employs TensorFlow.js and MediaPipe for real-time face detection and behavior analysis.
-   **Event Logging:** Tracks focus loss, absences, and multiple faces to identify potential integrity issues.
-   **Integrity Scoring Algorithm:** Calculates a score based on logged events to assess the integrity of the interview.
-   **PDF Report Generation:** Automatically generates a detailed report summarizing the interview, including the integrity score and logged events.
-   **Socket-Based Signaling:** Uses Socket.IO for efficient and reliable signaling during peer connection setup.
-   **Modular Architecture:** Designed with a modular architecture to facilitate scalability and maintainability.

## Tech Stack

-   **Frontend:** React, WebRTC, Socket.IO Client
-   **Backend:** Node.js, Express, Socket.IO Server
-   **Monitoring:** TensorFlow.js, MediaPipe FaceMesh
-   **Database:** MongoDB Atlas
-   **Reporting:** PDFKit

## Folder Structure

bash
    git clone https://github.com/your-username/interview-proctoring-platform.git
    cd interview-proctoring-platform
    javascript
        export const SIGNALING_SERVER_URL = 'http://localhost:5000';
        export const API_BASE_URL = 'http://localhost:5000';
                >  Adjust these URLs if your backend is running on a different port or server.

4.  **Start the application:**

        > The backend server should start on port 5000 (or the port you specified in your .env file), and the frontend should start on port 3000 (or the default port configured in your React setup).

**Troubleshooting:**

*   **Dependency Installation Issues:** If you encounter errors during `npm install`, try deleting the `node_modules` folder and the `package-lock.json` file, then run `npm install` again.
*   **MongoDB Connection Errors:** Ensure your MongoDB Atlas connection string is correct and that your IP address is whitelisted in your MongoDB Atlas cluster settings.  Also, verify that your MongoDB Atlas cluster is running.
*   **Port Conflicts:** If the backend or frontend fails to start due to a port conflict, change the `PORT` variable in the `.env` file or the frontend's configuration.
*   **WebRTC Issues:** WebRTC requires a secure context (HTTPS) in production.  For local development, using `localhost` is usually sufficient, but for deployment, you'll need to configure HTTPS.

## Testing the Flow

1.  **Open two browser tabs:**
2.  **Interviewer joins:** Navigate to `/` in one tab.
3.  **Candidate joins:** Navigate to `/join/:sessionId` in the other tab, replacing `:sessionId` with the session ID displayed to the interviewer.
4.  **Conduct the interview:** Proceed with the interview, observing the video streams and candidate monitoring.
5.  **End the session:** Terminate the interview session.
6.  **Candidate sends logs:** The candidate's monitoring logs are automatically sent to the server.
7.  **Interviewer receives report:** The interviewer receives a PDF report containing the integrity score and logged events.

## Integrity Scoring Logic

The integrity score is calculated based on the following formula:

`Integrity Score = 100 - (Focus Lost * Focus Loss Weight + Absence * Absence Weight + Multiple Faces * Multiple Faces Weight)`

Currently, the weights are configured as follows:

-   Focus Loss Weight: 2
-   Absence Weight: 3
-   Multiple Faces Weight: 5

This means that losing focus deducts 2 points, being absent from the camera's view deducts 3 points, and the presence of multiple faces deducts 5 points. The higher the score, the more confident we can be in the integrity of the interview.

> **Potential Improvements:** The weights can be adjusted based on empirical data and specific requirements. Machine learning models could be integrated to dynamically adjust the weights based on real-time analysis of the candidate's behavior and environmental factors. Adding more sophisticated analysis like gaze detection, voice stress analysis, and sentiment analysis can also significantly improve the accuracy of integrity scoring.

## Event Logging

The system logs various events during the interview to assess the candidate's behavior. The following table summarizes the logged events:

| Event Type      | Description                                                                 | Impact on Score |
| --------------- | --------------------------------------------------------------------------- | --------------- |
| Focus Loss      | The candidate's face is not detected within the camera's view for a period. | Moderate        |
| Absence         | The candidate is completely absent from the camera's view.                  | High            |
| Multiple Faces  | Multiple faces are detected in the camera's view.                           | High            |

> **Further Development**: Implement a feature to record the timestamps of these events in the report for detailed analysis.

## Contributing

We welcome contributions to the Interview Video Proctoring System! Please follow these guidelines:

1.  **Fork the repository:** Create your own fork of the repository.
2.  **Create a branch:** Create a new branch for your feature or bug fix.
3.  **Coding Standards:** Adhere to the existing coding style and conventions.  Use ESLint and Prettier to maintain code quality.
4.  **Commit messages:** Write clear and concise commit messages.
5.  **Pull requests:** Submit a pull request to the `main` branch.  Include a detailed description of your changes and the problem they solve.

> **Note:** Before submitting a pull request, ensure that your code is thoroughly tested and that all tests pass.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

