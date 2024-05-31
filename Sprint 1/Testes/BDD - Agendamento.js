import { defineFeature, loadFeature } from 'jest-cucumber';
import { inserirAgendamento, printAgendamentoQueue } from './path/to/your/module';
import { firebaseFirestore } from '../firebaseConfig';

jest.mock('../firebaseConfig');

const feature = loadFeature('./path/to/your/inserirAgendamento.feature');

defineFeature(feature, test => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Successful appointment insertion', ({ given, when, then }) => {
    let agendamento;

    given('an appointment with userId "user123" and specialist "Dr. John Doe"', () => {
      agendamento = {
        userId: 'user123',
        nomeEspecialista: 'Dr. John Doe',
        especialidade: 'Cardiologia',
        data: '2023-06-01',
        horario: '10:00',
        razao: 'Consulta de rotina',
        retorno: false,
      };
      firebaseFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            add: jest.fn().mockResolvedValue(),
          }),
        }),
      });
    });

    when('the appointment is enqueued and processed', async () => {
      await inserirAgendamento(agendamento);
    });

    then('the appointment should be added to the Firestore', () => {
      expect(firebaseFirestore.collection).toHaveBeenCalledWith('usuarios');
    });

    then('the queue should be empty', () => {
      expect(printAgendamentoQueue()).toBe('');
    });
  });

  test('Failed appointment insertion', ({ given, when, then }) => {
    let agendamento;
    let errorMessage;

    given('an appointment with userId "user123" and specialist "Dr. John Doe"', () => {
      agendamento = {
        userId: 'user123',
        nomeEspecialista: 'Dr. John Doe',
        especialidade: 'Cardiologia',
        data: '2023-06-01',
        horario: '10:00',
        razao: 'Consulta de rotina',
        retorno: false,
      };
      errorMessage = 'Erro ao adicionar agendamento';
      firebaseFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            add: jest.fn().mockRejectedValue(new Error(errorMessage)),
          }),
        }),
      });
    });

    when('there is an error during the insertion', async () => {
      await expect(inserirAgendamento(agendamento)).rejects.toThrow(errorMessage);
    });

    then('the process should throw an error', () => {
      expect(printAgendamentoQueue()).toBe('');
    });
  });
});
