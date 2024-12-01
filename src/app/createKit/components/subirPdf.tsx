'use client';
import { useState } from 'react';

type HomeProps = {
  onSubmit: (url: string) => void;
  nombre_prod: string;
  setNombre_prod: React.Dispatch<React.SetStateAction<string>>;
}

export default function SubirPdf({ onSubmit,nombre_prod,setNombre_prod }: HomeProps) {
  const [file, setFile] = useState<File | null>(null);
  const nombreArchivo = nombre_prod;
  const  setNombreArchivo = setNombre_prod;
  
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nombre_archivo', nombreArchivo);

    setIsLoading(true);

    try {
      const res = await fetch('https://deploybackenddiancrochet.onrender.com/admin/uploadFile', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        onSubmit(data.fileUrl); // Pasar la URL al componente padre
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Selecciona un archivo PDF</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm border text-black border-gray-300 rounded-lg p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del archivo</label>
        <input
          type="text"
          value={nombreArchivo}
          onChange={(e) => setNombreArchivo(e.target.value)}
          placeholder="Escribe un nombre"
          className="mt-2 block w-full text-sm border text-black border-gray-300 rounded-lg p-2"
          disabled
        />
      </div>
      <button
        type="submit"
        className={`w-full py-2 text-black rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={isLoading}
      >
        {isLoading ? 'Subiendo...' : 'Subir archivo'}
      </button>
    </form>
  );
}
