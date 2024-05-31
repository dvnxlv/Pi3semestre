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

const agendamentoQueue = new Queue();

const inserirAgendamento = async (agendamento) => {
  try {
    agendamentoQueue.enqueue(agendamento);
    console.log('Agendamento adicionado à fila:', agendamento);
    
    const currentAgendamento = agendamentoQueue.dequeue();
    
    await firebaseFirestore.collection('usuarios').doc(currentAgendamento.userId).collection('agendamentos').add({
      nomeEspecialista: currentAgendamento.nomeEspecialista,
      especialidade: currentAgendamento.especialidade,
      data: currentAgendamento.data,
      horario: currentAgendamento.horario,
      razao: currentAgendamento.razao,
      retorno: currentAgendamento.retorno,
      status: '', 
    });

    console.log('Agendamento adicionado com sucesso:', currentAgendamento);
  } catch (error) {
    console.error('Erro ao adicionar agendamento:', error);
    throw error;
  }
};

const printAgendamentoQueue = () => {
  console.log('Fila de agendamentos:');
  console.log(agendamentoQueue.printQueue());
};

export { inserirAgendamento, printAgendamentoQueue };
