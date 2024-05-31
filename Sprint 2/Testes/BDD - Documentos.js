import { defineFeature, loadFeature } from 'jest-cucumber';
import InserirDocumentos from './InserirDocumentos';
import { firebaseStorage, firebaseFirestore, firebaseAuth } from '../firebaseConfig';

jest.mock('../firebaseConfig');

const feature = loadFeature('./InserirDocumentos.feature');

defineFeature(feature, test => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Successful document insertion', ({ given, when, then }) => {
    given('a document URI "https://example.com/image.jpg", file name "example.jpg", and custom name "Example Image"', () => {
      const uri = 'https://example.com/image.jpg';
      const fileName = 'example.jpg';
      const customName = 'Example Image';
      const user = { uid: 'user123' };
      const reference = { put: jest.fn().mockResolvedValue() };
      const blob = jest.fn();
      const downloadURL = 'https://example.com/image_download.jpg';
      firebaseAuth.currentUser = user;
      firebaseStorage.ref.mockReturnValue(reference);
      fetch.mockResolvedValue({ blob });
    });

    when('the document is inserted', async () => {
      await InserirDocumentos('https://example.com/image.jpg', 'example.jpg', 'Example Image');
    });

    then('the document should be uploaded to Firebase Storage', () => {
      expect(firebaseStorage.ref).toHaveBeenCalledWith('fotos/user123/example.jpg');
      expect(reference.put).toHaveBeenCalled();
    });

    then('its URL should be added to Firestore', () => {
      expect(firebaseFirestore.collection().doc().collection().add).toHaveBeenCalledWith({
        url: 'https://example.com/image_download.jpg',
        fileName: 'example.jpg',
        customName: 'Example Image',
        createdAt: expect.any(Object)
      });
    });
  });

  test('Failed document insertion', ({ given, when, then }) => {
    given('a document URI "https://example.com/image.jpg", file name "example.jpg", and custom name "Example Image"', () => {
      const errorMessage = 'Error uploading document';
      fetch.mockRejectedValue(new Error(errorMessage));
    });

    when('there is an error during the insertion', async () => {
      await expect(InserirDocumentos('https://example.com/image.jpg', 'example.jpg', 'Example Image')).rejects.toThrow('Error uploading document');
    });

    then('an error should be thrown', () => {
    });
  });
});
