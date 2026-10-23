import { useState } from 'react';
import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { useFilesystem } from '../hooks/useFilesystem';

const FilesystemPage: React.FC = () => {
  const { writeFile, readFile, listFiles, deleteFile } = useFilesystem();
  const [output, setOutput] = useState<unknown>(null);

  const onWriteFile = async () => {
    await writeFile({
      path: 'mi-data.json',
      data: { nombre: 'Jonathan', curso: 'Ionic' },
    });
    setOutput('Archivo escrito');
  };

  const onReadFile = async () => {
    const data = await readFile({ path: 'mi-data.json' });
    console.log(data);
    setOutput(data);
  };

  const onListFiles = async () => {
    const files = await listFiles({});
    console.log(files);
    setOutput(files);
  };

  const onDeleteFile = async () => {
    await deleteFile({ path: 'mi-data.json' });
    setOutput('Archivo eliminado');
  };

  return (
    <SensorPage title="Archivos">
      <IonButton onClick={onWriteFile}>Escribir</IonButton>
      <IonButton onClick={onReadFile}>Leer</IonButton>
      <IonButton onClick={onListFiles}>Listar</IonButton>
      <IonButton onClick={onDeleteFile}>Eliminar</IonButton>

      <pre>{output !== null ? JSON.stringify(output, null, 2) : ''}</pre>
    </SensorPage>
  );
};

export default FilesystemPage;
