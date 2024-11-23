'use client';

import Footer from 'components/Footer';
import ProductForm from './components/Product_notallas_Form';
import HeaderAdmin from 'components/HeaderAdmin';
import SideBar from 'components/Sidebar';

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="h-[12%] w-full">
        <HeaderAdmin />
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-grow">
        {/* SideBar */}
        <SideBar />

        {/* Contenido principal */}
        <main className="flex-grow p-4 lg:ml-64 bg-slate-50">
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
