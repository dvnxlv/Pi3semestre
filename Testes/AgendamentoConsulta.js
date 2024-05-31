const { scheduleAppointment, cancelAppointment } = require('./appointment');

describe('Agendamento de consulta', () => {
  test('Agenda uma consulta', () => {
    const appointment = {
      user: 'danilo',
      date: '2024-03-10',
      time: '13:00'
    };

    expect(scheduleAppointment(appointment)).toBe(true);
  });

  test('Tenta agendar uma consulta em horário já ocupado', () => {
    const appointment = {
      user: 'lucca',
      date: '2024-03-12',
      time: '13:30'
    };

    scheduleAppointment(appointment);

    expect(scheduleAppointment(appointment)).toBe(false);
  });

  test('Cancela uma consulta', () => {
    const appointment = {
      user: 'diego',
      date: '2024-08-10',
      time: '11:00'
    };

    scheduleAppointment(appointment);

    expect(cancelAppointment('diego', '2024-08-10', '11:00')).toBe(true);
  });

  test('Tenta cancelar uma consulta inexistente', () => {
    expect(cancelAppointment('usuarioInexistente', '2024-03-12', '13:30')).toBe(false);
  });
});
