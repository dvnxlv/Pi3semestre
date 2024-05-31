import InserirDocumentos from './InserirDocumentos';
import { firebaseStorage, firebaseFirestore, firebaseAuth } from '../firebaseConfig';

jest.mock('../firebaseConfig');

describe('InserirDocumentos function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should enqueue and process document successfully', async () => {
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

    await InserirDocumentos(uri, fileName, customName);

    expect(firebaseStorage.ref).toHaveBeenCalledWith(`fotos/${user.uid}/${fileName}`);
    expect(reference.put).toHaveBeenCalled();
    expect(firebaseFirestore.collection().doc().collection().add).toHaveBeenCalledWith({
      url: downloadURL,
      fileName,
      customName,
      createdAt: expect.any(Object)
    });
  });

  it('should handle error during document insertion', async () => {
    const errorMessage = 'Error uploading document';
    fetch.mockRejectedValue(new Error(errorMessage));

    await expect(InserirDocumentos('https://example.com/image.jpg', 'example.jpg', 'Example Image')).rejects.toThrow(errorMessage);
  });
});
