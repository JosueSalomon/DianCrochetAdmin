"use client";

import Sidebar from "components/sidebar";
import Headerbar from "../../../components/HeaderAdmin";
import OrdenForm from "../components/posts/OrdenForm";
export default function Dash() {
  return (
    <main className="flex h-screen w-full bg-gray-200 overflow-hidden">
      
      {/* Sidebar con un ancho fijo */}
      <aside className="w-[250px] md:w-[300px] h-full fixed top-0 left-0 z-20">
        <Sidebar />
      </aside>
    
      {/* Contenido principal */}
      <div className="flex flex-col flex-1 h-full pl-[250px] md:pl-[300px]">
    
        {/* Header */}
        <header className="h-[10%] bg-gray-100 relative z-0">
          <Headerbar />
        </header>
    
        {/* Sección de contenido */}
        <section className="flex-1 overflow-y-auto">
          <OrdenForm />
        </section>
    
        
      </div>
    </main>
  );
}
