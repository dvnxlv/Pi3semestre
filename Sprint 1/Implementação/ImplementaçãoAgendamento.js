let scheduledAppointments = [];

function scheduleAppointment(appointment) {
  const existingAppointment = scheduledAppointments.find(appt => appt.date === appointment.date && appt.time === appointment.time);
  if (existingAppointment) {
    return false; 
  }

  scheduledAppointments.push(appointment);
  return true; 
}

function cancelAppointment(username, date, time) {
  const index = scheduledAppointments.findIndex(appt => appt.user === username && appt.date === date && appt.time === time);
  if (index === -1) {
    return false; 
  }

  scheduledAppointments.splice(index, 1);
  return true; 
}

module.exports = { scheduleAppointment, cancelAppointment };
