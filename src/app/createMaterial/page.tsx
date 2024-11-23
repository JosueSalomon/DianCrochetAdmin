'use client';

import Footer from "components/Footer";
import HeaderAdmin from 'components/HeaderAdmin'
import MaterialForm from "./components/MaterialesForm";



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
            <MaterialForm />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    );
  }
  