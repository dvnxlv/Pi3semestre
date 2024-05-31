import { firebaseStorage, firebaseFirestore, firebaseAuth } from '../firebaseConfig';
import firestore from '@react-native-firebase/firestore';

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

const documentosQueue = new Queue();

const InserirDocumentos = async (uri, fileName, customName) => {
  const user = firebaseAuth.currentUser;

  const reference = firebaseStorage.ref(`fotos/${user.uid}/${fileName}`);

  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    
    const fileExtension = fileName.split('.').pop();
    const contentTypeMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif'
    };
    const contentType = contentTypeMap[fileExtension] || 'application/octet-stream';

    const metadata = {
      contentType: contentType,
    };

    documentosQueue.enqueue({ reference, blob, fileName, customName });

    const processNextDocument = async () => {
      const currentDocument = documentosQueue.dequeue();
      if (!currentDocument) return; 

      const { reference, blob, fileName, customName } = currentDocument;

      const uploadTask = reference.put(blob, metadata);

      uploadTask.on('state_changed', 
        null, 
        (error) => {
          console.error('Erro ao fazer upload da imagem:', error);
          throw error;
        }, 
        async () => {
          const downloadURL = await reference.getDownloadURL();
          await firebaseFirestore
            .collection('usuarios')
            .doc(user.uid)
            .collection('documentos')
            .add({ 
              url: downloadURL, 
              fileName, 
              customName, 
              createdAt: firestore.FieldValue.serverTimestamp() 
            });
          
          console.log('Documento salvo no Firestore com sucesso.');
          processNextDocument(); 
        }
      );
    };

    if (documentosQueue.isEmpty()) {
      processNextDocument();
    }
  } catch (error) {
    console.error('Erro ao processar o upload:', error);
    throw error;
  }
};

export default InserirDocumentos;
