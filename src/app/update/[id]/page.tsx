'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "components/Footer";
import Navbar from "components/navbar";
import EditarMaterial from "../components/EditarMaterial";
import EditarProducto from "../components/EditarProducto";
import HeaderAdmin from "components/HeaderAdmin";
import Sidebar from "components/Sidebar";

// Define el tipo de la estructura de la respuesta de la API
interface ProductoInfo {
  id_producto: number;
  nombre_prod: string;
  precio_venta: number;
  descripcion: string;
  cantidad_disp: number;
  tipo_prod: string;
  color: string | null;
  tallas: string | null;
  grosores: string | null;
  imagen_principal: string;
  imagenes_extra: string[];
  nombre_marca: string | null;
  categorias: string[];
  keywords: string[];
}

interface ProductoResponse {
  productoInfo: ProductoInfo;
}

export default function Dashboard() {
  const { id } = useParams(); // Obtén el id dinámico de la URL
  const [tipoProd, setTipoProd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`https://deploybackenddiancrochet.onrender.com/admin/get/producto/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data: ProductoResponse = await response.json(); // Usa el tipo definido
        setTipoProd(data.productoInfo.tipo_prod); // Guarda el tipo_prod
        setLoading(false);
      } catch (err) {
        setError((err as Error).message); // Especifica que es un Error
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <p>Cargando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <p>Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">
       <div className="h-[12%] w-full">
                <HeaderAdmin/>
            </div>
            <Sidebar/>
      <main className="bg-slate-50 flex-grow justify-center items-center mt-[4.3%] h-full">
        <div className="flex justify-center items-center">
          {tipoProd === "Material" ? (
            <EditarMaterial id={id as string} />
          ) : tipoProd === "Producto" ? (
            <EditarProducto id={id as string} />
          ) : (
            <p>Tipo de producto no soportado</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
