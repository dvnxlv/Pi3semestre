const { registerUser, loginUser } = require('./user');

describe('Registro de usuário', () => {
  test('Registra um novo usuário', () => {
    const newUser = {
      username: 'danilo',
      password: '12345'
    };

    expect(registerUser(newUser)).toBe(true);
  });

  test('Tenta registrar um usuário já existente', () => {
    const existingUser = {
      username: 'lucca',
      password: '12345'
    };

    registerUser(existingUser);

    expect(registerUser(existingUser)).toBe(false);
  });
});

describe('Login de usuário', () => {
  test('Faz login com usuário registrado', () => {
    const registeredUser = {
      username: 'lucca',
      password: '12345'
    };

    registerUser(registeredUser);

    expect(loginUser('lucca', '12345')).toBe(true);
  });

  test('Tenta fazer login com usuário não registrado', () => {
    expect(loginUser('usuarioInexistente', 'senha')).toBe(false);
  });

  test('Tenta fazer login com senha incorreta', () => {
    const registeredUser = {
      username: 'diego',
      password: '45678'
    };

    registerUser(registeredUser);

    expect(loginUser('diego', 'senhaIncorreta')).toBe(false);
  });
});
