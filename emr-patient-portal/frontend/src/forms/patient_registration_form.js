import React, { useState } from 'react';
import './FormStyles.css';

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    medicalHistory: '',
    allergies: '',
    aadharNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    maritalStatus: '',
    occupation: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/submit-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      alert('Failed to register patient.');
    }
  };

  return (
    <div className="form-container">
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([field, value]) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={field === 'dob' ? 'date' : 'text'}
              id={field}
              name={field}
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;
