import { inserirAgendamento, printAgendamentoQueue } from './path/to/your/module';
import { firebaseFirestore } from '../firebaseConfig';

jest.mock('../firebaseConfig');

describe('inserirAgendamento function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should enqueue an agendamento and add it to Firestore', async () => {
    const agendamento = {
      userId: 'user123',
      nomeEspecialista: 'Dr. Silva',
      especialidade: 'Cardiologia',
      data: '2024-06-01',
      horario: '10:00',
      razao: 'Consulta de rotina',
      retorno: '2024-07-01'
    };
    
    firebaseFirestore.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          add: jest.fn().mockResolvedValue()
        })
      })
    });

    await inserirAgendamento(agendamento);
    
    expect(firebaseFirestore.collection).toHaveBeenCalledWith('usuarios');
    expect(printAgendamentoQueue()).toContain(JSON.stringify(agendamento));
  });

  it('should handle errors when adding an agendamento to Firestore', async () => {
    const agendamento = {
      userId: 'user123',
      nomeEspecialista: 'Dr. Silva',
      especialidade: 'Cardiologia',
      data: '2024-06-01',
      horario: '10:00',
      razao: 'Consulta de rotina',
      retorno: '2024-07-01'
    };
    
    firebaseFirestore.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          add: jest.fn().mockRejectedValue(new Error('Firestore error'))
        })
      })
    });

    await expect(inserirAgendamento(agendamento)).rejects.toThrow('Firestore error');

    expect(printAgendamentoQueue()).not.toContain(JSON.stringify(agendamento));
  });
});
