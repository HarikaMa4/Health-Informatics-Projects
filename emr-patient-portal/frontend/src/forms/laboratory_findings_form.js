import React, { useState } from 'react';
import './FormStyles.css';

function LaboratoryFindingsForm() {
  const [formData, setFormData] = useState({
    patientId: '',
    testName: '',
    testDate: '',
    result: '',
    normalRange: '',
    remarks: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/submit-lab-findings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const resultText = await response.text();
      alert(resultText);
    } catch (error) {
      console.error('❌ Error submitting lab findings:', error);
      alert('Failed to submit lab findings.');
    }
  };

  return (
    <div className="form-container">
      <h2>Laboratory Findings Form</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={key.includes('Date') ? 'date' : 'text'}
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Submit Lab Findings</button>
      </form>
    </div>
  );
}

export default LaboratoryFindingsForm;
