import { inserirDadosPessoais, printDadosPessoaisQueue } from './path/to/your/module';
import { firebaseFirestore } from '../firebaseConfig';

jest.mock('../firebaseConfig');

describe('inserirDadosPessoais function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should enqueue and process personal data', async () => {
    const userId = 'user123';
    const dadosPessoais = {
      nome: 'João',
      sobrenome: 'Silva',
      idade: 30,
      endereco: 'Rua das Flores, 123'
    };

    firebaseFirestore.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          doc: jest.fn().mockReturnValue({
            set: jest.fn().mockResolvedValue(),
          }),
        }),
      }),
    });

    await inserirDadosPessoais(userId, dadosPessoais);

    expect(firebaseFirestore.collection).toHaveBeenCalledWith('usuarios');
    expect(printDadosPessoaisQueue()).toBe('');
  });

  it('should handle errors during personal data insertion', async () => {
    const userId = 'user123';
    const dadosPessoais = {
      nome: 'João',
      sobrenome: 'Silva',
      idade: 30,
      endereco: 'Rua das Flores, 123'
    };
    const errorMessage = 'Erro ao adicionar dados pessoais';

    firebaseFirestore.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          doc: jest.fn().mockReturnValue({
            set: jest.fn().mockRejectedValue(new Error(errorMessage)),
          }),
        }),
      }),
    });

    await expect(inserirDadosPessoais(userId, dadosPessoais)).rejects.toThrow(errorMessage);
  });
});
