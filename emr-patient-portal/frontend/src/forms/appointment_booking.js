import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './appointment_booking.css';

const AppointmentBooking = () => {
  const [patientId, setPatientId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch doctor list on page load
    axios.get('http://localhost:3001/doctors')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('❌ Error fetching doctors:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch available times when doctor and date are selected
    if (selectedDoctor && appointmentDate) {
      axios.get('http://localhost:3001/available-times', {
        params: { doctorName: selectedDoctor, appointmentDate }
      })
      .then(response => {
        setTimeslots(response.data);
      })
      .catch(error => {
        console.error('❌ Error fetching available times:', error);
      });
    } else {
      setTimeslots([]); // reset
    }
  }, [selectedDoctor, appointmentDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!patientId || !selectedDoctor || !appointmentDate || !selectedTime || !reason) {
      setMessage('❗ Please fill out all fields.');
      return;
    }

    axios.post('http://localhost:3001/submit-appointment', {
      patientId,
      doctorName: selectedDoctor,
      appointmentDate,
      appointmentTime: selectedTime,
      reason,
    })
    .then(response => {
      setMessage('✅ Appointment booked successfully!');
      // Reset form
      setPatientId('');
      setSelectedDoctor('');
      setAppointmentDate('');
      setTimeslots([]);
      setSelectedTime('');
      setReason('');
    })
    .catch(error => {
      console.error('❌ Error booking appointment:', error);
      setMessage('❌ Failed to book appointment.');
    });
  };

  return (
    <div className="appointment-booking-container">
      <h2>Appointment Booking Form</h2>
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />

        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.doctor_id} value={doc.doctor_name}>
              {doc.doctor_name} ({doc.specialization})
            </option>
          ))}
        </select>

        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />

        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Select Available Time</option>
          {timeslots.length > 0 ? (
            timeslots.map((slot) => (
              <option key={slot.dbTime} value={slot.dbTime}>
                {slot.displayTime}
              </option>
            ))
          ) : (
            <option disabled>No times available</option>
          )}
        </select>

        <textarea
          placeholder="Reason for appointment"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>

        <button type="submit">Book Appointment</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AppointmentBooking;
