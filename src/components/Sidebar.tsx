'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CiGrid42 } from 'react-icons/ci';
import { TiArchive } from 'react-icons/ti';

export default function SideBar() {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Controla si la barra lateral está abierta (para dispositivos pequeños)

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
    setIsOpen(false); // Cierra la barra lateral al hacer clic en un botón en dispositivos pequeños

    // Redirigir a la ruta correspondiente
    if (button === 'orden') {
      router.push('/ordenes/all-ordens');
    } else if (button === 'product') {
      router.push('/productos');
    }
  };

  return (
    <>
      {/* Botón hamburguesa para dispositivos pequeños */}
      <button
        className="lg:hidden p-3 fixed top-4 left-4 z-50 bg-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
        <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
        <span className="block w-5 h-0.5 bg-gray-700"></span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-white p-5 shadow-lg border-solid border z-40 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex flex-row flex-nowrap justify-start items-center content-around mb-5">
          <Image src="/img/logo.svg" alt="Logo" width={60} height={60} />
          <h1 className="text-gray-950 ml-5 font-koulen">Dian Crochet</h1>
        </div>
        <div className="flex flex-col flex-nowrap justify-start items-start content-stretch font-rubik">
          <button
            type="button"
            title="orden"
            className={`text-gray-950 flex flex-row flex-nowrap justify-start items-center content-stretch mb-2 ${
              activeButton === 'orden' ? 'bg-purple-400 text-white' : ''
            } rounded-md p-3 w-full text-sm font-medium`}
            onClick={() => handleButtonClick('orden')}
          >
            <CiGrid42 className="mr-2 text-lg font-semibold" /> ORDENES
          </button>
          <button
            type="button"
            title="product"
            className={`text-gray-950 flex flex-row flex-nowrap justify-start items-center content-stretch ${
              activeButton === 'product' ? 'bg-purple-400 text-white' : ''
            } rounded-md p-3 w-full text-sm font-medium`}
            onClick={() => handleButtonClick('product')}
          >
            <TiArchive className="mr-2 text-lg" /> TODOS LOS PRODUCTOS
          </button>
        </div>
      </div>

      {/* Fondo oscuro cuando la barra lateral está abierta (dispositivos pequeños) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
