import { defineFeature, loadFeature } from 'jest-cucumber';
import { registerUser, printRegistrationAttempts } from './path/to/your/module';
import { firebaseAuth, firebaseFirestore } from './firebaseConfig';

jest.mock('./firebaseConfig');

const feature = loadFeature('./path/to/your/registerUser.feature');

defineFeature(feature, test => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Successful user registration', ({ given, when, then, and }) => {
    let email;
    let password;
    let userCredential;

    given(/^a user with email "(.*)" and password "(.*)"$/, (givenEmail, givenPassword) => {
      email = givenEmail;
      password = givenPassword;
      userCredential = {
        user: {
          uid: '12345',
          email: email,
        },
      };
      firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue(userCredential);
      firebaseFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          set: jest.fn().mockResolvedValue(),
        }),
      });
    });

    when('the user tries to register', async () => {
      await registerUser(email, password);
    });

    then('the user should be registered successfully', () => {
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });

    and('the attempt should be recorded in the stack as "success"', () => {
      expect(printRegistrationAttempts()).toContain(`email: ${email}, status: 'success'`);
    });
  });

  test('Failed user registration', ({ given, when, then, and }) => {
    let email;
    let password;
    let errorMessage;

    given(/^a user with email "(.*)" and password "(.*)"$/, (givenEmail, givenPassword) => {
      email = givenEmail;
      password = givenPassword;
      errorMessage = 'Registration failed';
      firebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));
    });

    when('the user tries to register', async () => {
      await expect(registerUser(email, password)).rejects.toThrow(errorMessage);
    });

    then('the attempt should be recorded in the stack as "failure"', () => {
      expect(printRegistrationAttempts()).toContain(`email: ${email}, status: 'failure'`);
    });
  });
});
