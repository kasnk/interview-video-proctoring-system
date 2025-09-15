import { useEffect, useRef } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default function useMonitoring(videoRef, sessionId) {
  const logRef = useRef([]);

  useEffect(() => {
    const candidateName = localStorage.getItem('candidateName');

    if (!candidateName) {
      console.log(`[Monitoring] Skipped: Not a candidate`);
      return;
    }

    console.log(`[Monitoring] Initialized for candidate: ${candidateName}, session: ${sessionId}`);

    let detector;
    let objectDetector;
    let lastEvent = null;
    let absenceStart = null;

const loadModel = async () => {
  try {
    console.log(`[Monitoring] Setting TensorFlow backend to webgl...`);
    await tf.setBackend('webgl');
    await tf.ready();
    console.log(`[Monitoring] TensorFlow backend ready`);

    console.log(`[Monitoring] Creating face detector...`);
    detector = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: 'tfjs',
        refineLandmarks: true,
        maxFaces: 1
      }
    );
    console.log(`[Monitoring] Face detector created successfully`);

    console.log(`[Monitoring] Loading COCO-SSD object detector...`);
    objectDetector = await cocoSsd.load();
    console.log(`[Monitoring] COCO-SSD object detector loaded successfully`);

    // ✅ Add startup delay to allow webcam to stabilize
    setTimeout(() => {
      console.log(`[Monitoring] Starting detection loop after 1s delay`);
        detectLoop();
      }, 1000);
    } catch (err) {
      console.error(`[Monitoring] Model load failed:`, err);
    }
  };

    const detectLoop = async () => {
      if (
        !videoRef.current ||
        !videoRef.current.srcObject ||
        videoRef.current.readyState < 2
      ) {
        console.log(`[Monitoring] Video not ready`);
        requestAnimationFrame(detectLoop);
        return;
      }


      try {
        const faces = await detector.estimateFaces(videoRef.current);
        const validFaces = faces.filter(face => face.keypoints?.length > 0);        const now = new Date().toISOString();

        // Object detection for suspicious items
        const objects = await objectDetector.detect(videoRef.current);
        const suspiciousObjects = objects.filter(obj => 
          ['cell phone', 'book', 'laptop', 'tablet', 'mouse', 'keyboard'].includes(obj.class.toLowerCase()) && 
          obj.score > 0.5
        );

        suspiciousObjects.forEach(obj => {
          console.log(`[Monitoring] Suspicious object detected: ${obj.class} (confidence: ${obj.score.toFixed(2)})`);
          logEvent('suspicious_object_detected', now, { object: obj.class, confidence: obj.score });
        });

        if (validFaces.length === 0) {
          if (!absenceStart) {
            absenceStart = now;
            console.log(`[Monitoring] Valid faces detected: ${validFaces.length}`);
          } else if (Date.now() - new Date(absenceStart).getTime() > 3000) {
            logEvent('user_absent', now);
            absenceStart = null;
          }
        } else {
          absenceStart = null;
          const face = faces[0];
          const nose = face.keypoints.find(k => k.name === 'noseTip');
          const leftEye = face.keypoints.find(k => k.name === 'leftEye');
          const rightEye = face.keypoints.find(k => k.name === 'rightEye');

          const eyeCenterX = (leftEye.x + rightEye.x) / 2;
          const dx = nose.x - eyeCenterX;

          if (Math.abs(dx) > 20) {
            logEvent('focus_lost', now);
          }

          if (faces.length > 1) {
            logEvent('multiple_faces_detected', now);
          }
        }
      } catch (err) {
        console.error(`[Monitoring] Detection error:`, err);
      }

      requestAnimationFrame(detectLoop);
    };

    const logEvent = (type, timestamp, extra = {}) => {
      const event = { type, timestamp, ...extra };
      logRef.current.push(event);
      console.log(`[Monitoring] Event logged: ${type} at ${timestamp}`, extra);
    };

    loadModel();

    return () => {
      console.log(`[Monitoring] Cleanup for session: ${sessionId}`);
    };
  }, [videoRef, sessionId]);

  return logRef;
}
