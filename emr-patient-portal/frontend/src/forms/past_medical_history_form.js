import React, { useState } from 'react';
import './FormStyles.css'; // ✅ Global form styling

function PastMedicalHistoryForm() {
  const [patientId, setPatientId] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [pastSurgeries, setPastSurgeries] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [medications, setMedications] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const historyData = {
      patientId,
      chronicConditions,
      pastSurgeries,
      familyHistory,
      medications,
    };

    try {
      const response = await fetch('http://localhost:3001/submit-medical-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyData),
      });

      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error('❌ Error submitting history:', error);
      alert('Failed to submit history.');
    }
  };

  return (
    <div className="form-container">
      <h2>Past Medical History Form</h2>
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
          <label>Chronic Conditions</label>
          <textarea
            value={chronicConditions}
            onChange={(e) => setChronicConditions(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Past Surgeries</label>
          <textarea
            value={pastSurgeries}
            onChange={(e) => setPastSurgeries(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Family History</label>
          <textarea
            value={familyHistory}
            onChange={(e) => setFamilyHistory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Current Medications</label>
          <textarea
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
          />
        </div>

        <button type="submit">Submit History</button>
      </form>
    </div>
  );
}

export default PastMedicalHistoryForm;
