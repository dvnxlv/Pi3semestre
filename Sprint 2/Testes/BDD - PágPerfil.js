import { defineFeature, loadFeature } from 'jest-cucumber';
import { inserirDadosPessoais, printDadosPessoaisQueue } from './path/to/your/module';
import { firebaseFirestore } from '../firebaseConfig';

jest.mock('../firebaseConfig');

const feature = loadFeature('./path/to/your/inserirDadosPessoais.feature');

defineFeature(feature, test => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Successful personal data insertion', ({ given, when, then }) => {
    let userId;
    let dadosPessoais;

    given('a user with ID "user123" and personal data "João Silva, 30 anos, Rua das Flores, 123"', () => {
      userId = 'user123';
      dadosPessoais = {
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
    });

    when('the personal data is enqueued and processed', async () => {
      await inserirDadosPessoais(userId, dadosPessoais);
    });

    then('the personal data should be added to the Firestore', () => {
      expect(firebaseFirestore.collection).toHaveBeenCalledWith('usuarios');
    });

    then('the queue should be empty', () => {
      expect(printDadosPessoaisQueue()).toBe('');
    });
  });

  test('Failed personal data insertion', ({ given, when, then }) => {
    let userId;
    let dadosPessoais;
    let errorMessage;

    given('a user with ID "user123" and personal data "João Silva, 30 anos, Rua das Flores, 123"', () => {
      userId = 'user123';
      dadosPessoais = {
        nome: 'João',
        sobrenome: 'Silva',
        idade: 30,
        endereco: 'Rua das Flores, 123'
      };
      errorMessage = 'Erro ao adicionar dados pessoais';
      firebaseFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
              set: jest.fn().mockRejectedValue(new Error(errorMessage)),
            }),
          }),
        }),
      });
    });

    when('there is an error during the insertion', async () => {
      await expect(inserirDadosPessoais(userId, dadosPessoais)).rejects.toThrow(errorMessage);
    });

    then('the process should throw an error', () => {
      expect(printDadosPessoaisQueue()).toBe('');
    });
  });
});
