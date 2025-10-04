import React, { useState } from 'react';
import './FormStyles.css'; // ✅ Import your global form styles

function PatientTreatmentForm() {
  const [patientId, setPatientId] = useState('');
  const [treatmentDate, setTreatmentDate] = useState('');
  const [treatmentDescription, setTreatmentDescription] = useState('');
  const [prescribedMedications, setPrescribedMedications] = useState('');
  const [lifestyleRecommendations, setLifestyleRecommendations] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const treatmentData = {
      patientId,
      treatmentDate,
      treatmentDescription,
      prescribedMedications,
      lifestyleRecommendations,
      nextReviewDate,
    };

    try {
      const response = await fetch('http://localhost:3001/submit-treatment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treatmentData),
      });

      const resultText = await response.text();
      alert(resultText);
    } catch (error) {
      console.error('❌ Error submitting treatment:', error);
      alert('Failed to submit treatment.');
    }
  };

  return (
    <div className="form-container">
      <h2>Treatment Plan Form</h2>
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
          <label>Treatment Date</label>
          <input
            type="date"
            value={treatmentDate}
            onChange={(e) => setTreatmentDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Treatment Description</label>
          <textarea
            value={treatmentDescription}
            onChange={(e) => setTreatmentDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Prescribed Medications</label>
          <textarea
            value={prescribedMedications}
            onChange={(e) => setPrescribedMedications(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Lifestyle Recommendations</label>
          <textarea
            value={lifestyleRecommendations}
            onChange={(e) => setLifestyleRecommendations(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Next Review Date</label>
          <input
            type="date"
            value={nextReviewDate}
            onChange={(e) => setNextReviewDate(e.target.value)}
          />
        </div>

        <button type="submit">Submit Treatment Plan</button>
      </form>
    </div>
  );
}

export default PatientTreatmentForm;
