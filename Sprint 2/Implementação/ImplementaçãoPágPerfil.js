import { firebaseFirestore } from '../firebaseConfig';

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  printQueue() {
    return this.items.join(", ");
  }
}

const dadosPessoaisQueue = new Queue();

const inserirDadosPessoais = async (userId, dadosPessoais) => {
  try {
    dadosPessoaisQueue.enqueue({ userId, dadosPessoais });
    console.log('Dados pessoais adicionados à fila:', userId);

    const currentDadosPessoais = dadosPessoaisQueue.dequeue();

    await firebaseFirestore.collection('usuarios').doc(currentDadosPessoais.userId).collection('dados_pessoais').doc('info').set(currentDadosPessoais.dadosPessoais);
    console.log('Dados pessoais adicionados com sucesso:', currentDadosPessoais.userId);
  } catch (error) {
    console.error('Erro ao adicionar dados pessoais:', error);
    throw error;
  }
};

const printDadosPessoaisQueue = () => {
  console.log('Fila de dados pessoais:');
  console.log(dadosPessoaisQueue.printQueue());
};

export { inserirDadosPessoais, printDadosPessoaisQueue };
