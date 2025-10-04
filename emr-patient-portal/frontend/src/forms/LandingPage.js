import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const [patientId, setPatientId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (patientId.trim() !== '') {
      navigate(`/search-patient?patientId=${patientId}`);
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-card">
        <h1>Welcome to Mini Electronic Health Record System</h1>
        <p className="subtitle">Please select the section you want to visit:</p>

        <div className="button-grid">
          <Link to="/patient-registration"><button>Patient Registration</button></Link>
          <Link to="/past-medical-history"><button>Past Medical History</button></Link>
          <Link to="/laboratory-findings"><button>Laboratory Findings</button></Link>
          <Link to="/patient-diagnosis"><button>Diagnosis</button></Link>
          <Link to="/patient-treatment"><button>Treatment</button></Link>
          <Link to="/appointment-booking"><button>Book Appointment</button></Link> {/* ✅ ADD THIS LINE */}
        </div>

        <div className="search-section">
          <h2>Search Patient Records</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
