import React, { useState } from 'react';
import './FormStyles.css'; // ✅ Global styling

function PatientDiagnosisForm() {
  const [patientId, setPatientId] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState('');
  const [diagnosisDescription, setDiagnosisDescription] = useState('');
  const [diagnosedBy, setDiagnosedBy] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const diagnosisData = {
      patientId,
      diagnosisDate,
      diagnosisDescription,
      diagnosedBy,
      followUpRequired,
    };

    try {
      const response = await fetch('http://localhost:3001/submit-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diagnosisData),
      });

      const resultText = await response.text();
      alert(resultText);
    } catch (error) {
      console.error('❌ Error submitting diagnosis:', error);
      alert('Failed to submit diagnosis.');
    }
  };

  return (
    <div className="form-container">
      <h2>Diagnosis Form</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Patient ID</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Diagnosis Date</label>
          <input
            type="date"
            value={diagnosisDate}
            onChange={(e) => setDiagnosisDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Diagnosis Description</label>
          <textarea
            value={diagnosisDescription}
            onChange={(e) => setDiagnosisDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Diagnosed By</label>
          <input
            type="text"
            value={diagnosedBy}
            onChange={(e) => setDiagnosedBy(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={followUpRequired}
              onChange={(e) => setFollowUpRequired(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Follow-Up Required
          </label>
        </div>

        <button type="submit">Submit Diagnosis</button>
      </form>
    </div>
  );
}

export default PatientDiagnosisForm;
