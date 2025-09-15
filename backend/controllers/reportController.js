import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateReport = async (req, res) => {
  try {
    const { candidateName, sessionId, logs } = req.body;

    console.log(`[Report] Received request for session: ${sessionId}`);
    console.log(`[Report] Candidate: ${candidateName}`);
    console.log(`[Report] Logs received:`, logs);

    if (!logs || logs.length === 0) {
      console.warn(`[Report] No monitoring data received for session: ${sessionId}`);
      return res.status(200).json({
        message: 'No monitoring data received',
        score: 0
      });
    }

    const focusLost = logs.filter(e => e.type === 'focus_lost').length;
    const absence = logs.filter(e => e.type === 'user_absent').length;
    const multipleFaces = logs.filter(e => e.type === 'multiple_faces_detected').length;
    const suspiciousObjects = logs.filter(e => e.type === 'suspicious_object_detected').length;

    console.log(`[Report] Event counts — Focus Lost: ${focusLost}, Absence: ${absence}, Multiple Faces: ${multipleFaces}, Suspicious Objects: ${suspiciousObjects}`);

    const integrityScore = Math.max(0, 100 - (focusLost * 2 + absence * 3 + multipleFaces * 5 + suspiciousObjects * 4));
    console.log(`[Report] Calculated Integrity Score: ${integrityScore}`);

    const doc = new PDFDocument();
    const filePath = path.join('reports', `${sessionId}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Proctoring Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Candidate Name: ${candidateName}`);
    doc.text(`Session ID: ${sessionId}`);
    doc.text(`Interview Duration: ${logs.length > 0 ? logs[logs.length - 1].timestamp : 'N/A'}`);
    doc.text(`Focus Lost Events: ${focusLost}`);
    doc.text(`Absence Events: ${absence}`);
    doc.text(`Multiple Faces Events: ${multipleFaces}`);
    doc.text(`Suspicious Objects Events: ${suspiciousObjects}`);
    doc.text(`Final Integrity Score: ${integrityScore}`);
    doc.end();

    console.log(`[Report] PDF generated at: ${filePath}`);

    res.status(200).json({ message: 'Report generated', score: integrityScore });
  } catch (err) {
    console.error(`[Report] Error generating report:`, err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
