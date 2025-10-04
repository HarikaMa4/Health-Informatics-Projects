console.log("🚀 Server loaded");

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================
// 🗄️ Database Connection
// ====================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Lakshmi@123',
  database: 'emr'
});

console.log('⏳ Trying to connect to MySQL...');
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// ========================================================
// 🩺 DOCTOR + APPOINTMENT MODULE
// ========================================================

// 1. // 1. Get list of doctors (doctor_name + specialization)
app.get('/doctors', (req, res) => {
  const query = 'SELECT doctor_name, specialization FROM doctors';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching doctors:', err.message);
      return res.status(500).send('Error fetching doctors.');
    }
    res.json(results);
  });
});

//2. Get available time slots for doctor on selected date
app.get('/available-times', (req, res) => {
  const { doctorName, appointmentDate } = req.query;

  if (!doctorName || !appointmentDate) {
    return res.status(400).send('Doctor name and appointment date are required.');
  }

  const doctorQuery = `
    SELECT availability_start, availability_end
    FROM doctors
    WHERE doctor_name = ?
  `;

  db.query(doctorQuery, [doctorName], (err, doctorResults) => {
    if (err) {
      console.error('❌ Error fetching doctor availability:', err.message);
      return res.status(500).send('Error fetching doctor availability.');
    }

    if (doctorResults.length === 0) {
      return res.status(404).send('Doctor not found.');
    }

    const { availability_start, availability_end } = doctorResults[0];

    const slots = [];
    let current = new Date(`1970-01-01T${availability_start}`);
    const end = new Date(`1970-01-01T${availability_end}`);

    while (current <= end) {
      const timeFormatted = formatTimeAMPM(current);
      const dbTimeFormat = current.toTimeString().substring(0, 8); // like "09:30:00"

      slots.push({ dbTime: dbTimeFormat, displayTime: timeFormatted });

      current.setMinutes(current.getMinutes() + 30); // ➡️ add 30 minutes
    }

    const appointmentQuery = `
      SELECT appointment_time FROM appointments
      WHERE doctor_name = ? AND appointment_date = ?
    `;

    db.query(appointmentQuery, [doctorName, appointmentDate], (err, bookedResults) => {
      if (err) {
        console.error('❌ Error fetching booked appointments:', err.message);
        return res.status(500).send('Error fetching booked appointments.');
      }

      const bookedSlots = bookedResults.map(r => r.appointment_time);

      const availableSlots = slots.filter(slot => !bookedSlots.includes(slot.dbTime));

      res.json(availableSlots); // sending [{dbTime: "09:00:00", displayTime: "9:00 AM"}, ...]
    });
  });
});

// Helper function
function formatTimeAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

// 3. Book an appointment (store doctor_name directly)
app.post('/submit-appointment', (req, res) => {
  const { patientId, doctorName, appointmentDate, appointmentTime, reason } = req.body;

  const sql = `
    INSERT INTO appointments (patient_id, doctor_name, appointment_date, appointment_time, reason)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [patientId, doctorName, appointmentDate, appointmentTime, reason], (err) => {
    if (err) {
      console.error('❌ Error booking appointment:', err.message);
      return res.status(500).send('Error booking appointment.');
    }
    res.send('✅ Appointment booked successfully.');
  });
});

// ========================================================
// 🧑‍⚕️ PATIENT MODULES
// ========================================================

// 4. Register new patient
app.post('/submit-patient', (req, res) => {
  const {
    patientId, firstName, lastName, dob, gender, email, phone, address,
    medicalHistory, allergies, aadharNumber, emergencyContact, emergencyPhone,
    maritalStatus, occupation
  } = req.body;

  const query = `
    INSERT INTO patients
    (patient_id, first_name, last_name, dob, gender, email, phone, address,
    medical_history, allergies, aadhar_number, emergency_contact, emergency_phone,
    marital_status, occupation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    patientId, firstName, lastName, dob, gender, email, phone, address,
    medicalHistory, allergies, aadharNumber, emergencyContact, emergencyPhone,
    maritalStatus, occupation
  ], (err) => {
    if (err) {
      console.error('❌ Error inserting patient:', err.message);
      return res.status(500).send('Error registering patient.');
    }
    res.send('✅ Patient registered successfully.');
  });
});

// 5. Submit medical history
app.post('/submit-medical-history', (req, res) => {
  const { patientId, chronicConditions, pastSurgeries, familyHistory, medications } = req.body;

  const sql = `
    INSERT INTO medical_history (patient_id, chronic_conditions, past_surgeries, family_history, medications)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [patientId, chronicConditions, pastSurgeries, familyHistory, medications], (err) => {
    if (err) {
      console.error("❌ Error inserting medical history:", err.message);
      return res.status(500).send("Error saving medical history.");
    }
    res.send("✅ Medical history submitted successfully.");
  });
});

// 6. Submit lab findings
app.post('/submit-lab-findings', (req, res) => {
  const { patientId, testName, testDate, result, normalRange, remarks } = req.body;

  const sql = `
    INSERT INTO laboratory_findings
    (patient_id, test_name, test_date, result, normal_range, remarks)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [patientId, testName, testDate, result, normalRange, remarks], (err) => {
    if (err) {
      console.error("❌ Error inserting lab findings:", err.message);
      return res.status(500).send("Error saving lab findings.");
    }
    res.send("✅ Lab findings submitted successfully.");
  });
});

// 7. Submit diagnosis
app.post('/submit-diagnosis', (req, res) => {
  const { patientId, diagnosisDate, diagnosisDescription, diagnosedBy, followUpRequired } = req.body;

  const sql = `
    INSERT INTO diagnosis
    (patient_id, diagnosis_date, diagnosis_description, diagnosed_by, follow_up_required)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [patientId, diagnosisDate, diagnosisDescription, diagnosedBy, followUpRequired], (err) => {
    if (err) {
      console.error("❌ Error inserting diagnosis:", err.message);
      return res.status(500).send("Error saving diagnosis.");
    }
    res.send("✅ Diagnosis submitted successfully.");
  });
});

// 8. Submit treatment plan
app.post('/submit-treatment', (req, res) => {
  const {
    patientId, treatmentDate, treatmentDescription,
    prescribedMedications, lifestyleRecommendations, nextReviewDate
  } = req.body;

  const sql = `
    INSERT INTO treatment_plans
    (patient_id, treatment_date, treatment_description, prescribed_medications, lifestyle_recommendations, next_review_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    patientId, treatmentDate, treatmentDescription,
    prescribedMedications, lifestyleRecommendations, nextReviewDate
  ], (err) => {
    if (err) {
      console.error("❌ Error inserting treatment plan:", err.message);
      return res.status(500).send("Error saving treatment plan.");
    }
    res.send("✅ Treatment plan submitted successfully.");
  });
});

// ========================================================
// 📋 Patient Summary
// ========================================================
app.get('/search-patient', (req, res) => {
  const { patientId } = req.query;

  const queries = {
    patient: 'SELECT * FROM patients WHERE patient_id = ?',
    appointments: 'SELECT * FROM appointments WHERE patient_id = ?',
    medicalHistory: 'SELECT * FROM medical_history WHERE patient_id = ?',
    labFindings: 'SELECT * FROM laboratory_findings WHERE patient_id = ?',
    diagnosis: 'SELECT * FROM diagnosis WHERE patient_id = ?',
    treatment: 'SELECT * FROM treatment_plans WHERE patient_id = ?'
  };

  const results = {};

  db.query(queries.patient, [patientId], (err, patient) => {
    if (err) return res.status(500).send('Error retrieving patient data');
    results.patient = patient[0] || {};

    db.query(queries.appointments, [patientId], (err, appointments) => {
      if (err) return res.status(500).send('Error retrieving appointments');
      results.appointments = appointments || [];

      db.query(queries.medicalHistory, [patientId], (err, history) => {
        if (err) return res.status(500).send('Error retrieving medical history');
        results.medicalHistory = history || [];

        db.query(queries.labFindings, [patientId], (err, lab) => {
          if (err) return res.status(500).send('Error retrieving lab findings');
          results.labFindings = lab || [];

          db.query(queries.diagnosis, [patientId], (err, diagnosis) => {
            if (err) return res.status(500).send('Error retrieving diagnosis');
            results.diagnosis = diagnosis || [];

            db.query(queries.treatment, [patientId], (err, treatment) => {
              if (err) return res.status(500).send('Error retrieving treatment');
              results.treatment = treatment || [];

              res.json(results);
            });
          });
        });
      });
    });
  });
});

// ========================================================
// 🌎 Root Route
// ========================================================
app.get('/', (req, res) => {
  res.send('✅ Backend running properly!');
});

// ========================================================
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
