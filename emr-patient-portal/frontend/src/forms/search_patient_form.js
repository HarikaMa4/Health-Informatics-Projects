import React, { useState } from 'react';
import './SearchStyles.css'; // ✅ Important change here

function SearchPatientForm() {
  const [patientId, setPatientId] = useState('');
  const [summary, setSummary] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/search-patient?patientId=${patientId}`);
      if (!response.ok) {
        throw new Error('Server error'); // ✅ handle 500 errors
      }
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('❌ Error fetching summary:', error);
      alert('Failed to load patient data.');
    }
  };

  const renderTableSection = (title, data) => (
    <>
      <h3>{title}</h3>
      <table className="summary-table">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <th>{key.replace(/_/g, ' ')}</th>
              <td>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div className="search-container"> {/* ✅ changed container */}
      <h2>Search Patient Records</h2>
      <form className="search-form" onSubmit={handleSearch}> {/* ✅ flex row */}
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {summary && (
        <div className="summary-table-wrapper">
          {summary.patient && renderTableSection('Patient Info', summary.patient)}

          {summary.appointments?.length > 0 ? (
            summary.appointments.map((item, index) =>
              renderTableSection(`Appointment #${index + 1}`, item)
            )
          ) : (
            <p>No appointment records found.</p>
          )}

          {summary.medicalHistory?.length > 0 ? (
            summary.medicalHistory.map((item, index) =>
              renderTableSection(`Medical History #${index + 1}`, item)
            )
          ) : (
            <p>No medical history found.</p>
          )}

          {summary.labFindings?.length > 0 ? (
            summary.labFindings.map((item, index) =>
              renderTableSection(`Lab Finding #${index + 1}`, item)
            )
          ) : (
            <p>No lab findings found.</p>
          )}

          {summary.diagnosis?.length > 0 ? (
            summary.diagnosis.map((item, index) =>
              renderTableSection(`Diagnosis #${index + 1}`, item)
            )
          ) : (
            <p>No diagnosis records found.</p>
          )}

          {summary.treatment?.length > 0 ? (
            summary.treatment.map((item, index) =>
              renderTableSection(`Treatment Plan #${index + 1}`, item)
            )
          ) : (
            <p>No treatment plan records found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPatientForm;
