'use client';

import Footer from 'components/Footer';
import ProductForm from './components/Product_notallas_Form';
import HeaderAdmin from 'components/HeaderAdmin';


export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="h-[12%] w-full">
        <HeaderAdmin />
      </div>

      {/* Contenedor principal */}
      <div className="flex h-full w-full bg-slate-50">
      

        {/* Contenido principal */}
        <main className="flex-grow p-4 bg-slate-50">
          <div className="flex justify-center items-center mt-[5%]">
            <ProductForm />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
