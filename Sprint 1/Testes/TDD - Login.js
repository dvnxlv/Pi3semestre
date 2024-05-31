import { firebaseAuth, firebaseFirestore } from './firebaseConfig';

class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  printStack() {
    return this.items.join(", ");
  }
}

const registrationAttempts = new Stack();

const registerUser = async (email, password) => {
  try {
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await firebaseFirestore.collection('usuarios').doc(user.uid).set({
      email: user.email,
    });

    registrationAttempts.push({ email, status: 'success', timestamp: new Date() });

    console.log('Usuário registrado com sucesso:', user.uid);
  } catch (error) {
    registrationAttempts.push({ email, status: 'failure', timestamp: new Date(), error: error.message });

    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

const printRegistrationAttempts = () => {
  console.log('Histórico de tentativas de registro:');
  console.log(registrationAttempts.printStack());
};

export { registerUser, printRegistrationAttempts };
