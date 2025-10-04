import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './forms/LandingPage';
import AppointmentBookingForm from './forms/appointment_booking';
import PatientRegistrationForm from './forms/patient_registration_form';
import PatientDiagnosisForm from './forms/patient_diagnosis_form';  // ✅ OK
import LaboratoryFindingsForm from './forms/laboratory_findings_form';
import PastMedicalHistoryForm from './forms/past_medical_history_form';
import PatientTreatmentForm from './forms/patient_treatment_plan_form';
import SearchPatientForm from './forms/search_patient_form';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/appointment-booking" element={<AppointmentBookingForm />} />
        <Route path="/patient-registration" element={<PatientRegistrationForm />} />
        <Route path="/patient-diagnosis" element={<PatientDiagnosisForm />} /> {/* ✅ Corrected */}
        <Route path="/laboratory-findings" element={<LaboratoryFindingsForm />} />
        <Route path="/past-medical-history" element={<PastMedicalHistoryForm />} />
        <Route path="/patient-treatment" element={<PatientTreatmentForm />} /> {/* ✅ Corrected */}
        <Route path="/search-patient" element={<SearchPatientForm />} />
      </Routes>
    </Router>
  );
}

export default App;
