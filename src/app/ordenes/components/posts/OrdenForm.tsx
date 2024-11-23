"use cliente";
import React, { useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { GrStatusGoodSmall } from "react-icons/gr";


// Interfaz para las órdenes
interface Orden {
    id_factura: number;
    codigo_fact: string;
    fecha_fact: string;
    nombre: string;
    estado_fact: string;
    color: string;
  }
export default function Dashboard() {
   // Estado para almacenar las órdenes
   const [ordenes, setOrdenes] = useState<Orden[]>([]);
   const [fechaInicio, setFechaInicio] = useState<string>("");
   const [fechaFin, setFechaFin] = useState<string>("");
   const [ordenamiento, setOrdenamiento] = useState<"asc" | "desc" | "">(""); 
   const detailsClick = (id: number) => {
    localStorage.setItem("ordenSeleccionada", id.toString()); // Guarda el ID de la orden
    window.location.href = "/ordenes/details-orden"; // Redirige a la vista de detalles
  };
 
   // Función para obtener las órdenes
  const fetchOrdenes = async () => {
    try {
      const response = await fetch(
        "https://deploybackenddiancrochet.onrender.com/admin/ordenes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setOrdenes(data.ordenes);
      if (data.ordenes.length > 0) {
        obtenerRangoDeFechas(data.ordenes);
      }
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
    }
  };

  const parseFecha = (fecha: string): Date => {
    const partes = fecha.split(/[-/]/);
  
    if (partes[0].length === 4) {
      // Formato YYYY-MM-DD
      return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    } else {
      // Asumimos formato DD/MM/YYYY
      return new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
    }
  };
  
  const obtenerRangoDeFechas = (ordenes: Orden[]) => {
    const fechas = ordenes.map((orden) => parseFecha(orden.fecha_fact).getTime());
  
    if (fechas.length === 0) return;
  
    const fechaMin = new Date(Math.min(...fechas));
    const fechaMax = new Date(Math.max(...fechas));
  
    const opciones = { year: "numeric", month: "short", day: "numeric" } as const;
    setFechaInicio(fechaMin.toLocaleDateString("en-US", opciones));
    setFechaFin(fechaMax.toLocaleDateString("en-US", opciones));
  };

  // Función para ordenar las órdenes por fecha
  const ordenarPorFecha = (tipo: "asc" | "desc") => {
    const ordenesOrdenadas = [...ordenes].sort((a, b) => {
      const fechaA = new Date(a.fecha_fact).getTime();
      const fechaB = new Date(b.fecha_fact).getTime();
      return tipo === "asc" ? fechaA - fechaB : fechaB - fechaA;
    });
    setOrdenes(ordenesOrdenadas);
  };

  // Manejar el cambio en el select
  const manejarOrdenamiento = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value as "asc" | "desc";
    setOrdenamiento(valor);
    ordenarPorFecha(valor);
  };
  
 

   // Obtener órdenes al cargar el componente
   useEffect(() => {
    fetchOrdenes();
  }, []);
    return(
        <>
        <div id="Primary" className="flex flex-col justify-start items-start w-full h-full overflow-auto p-5">
  {/* Encabezado */}
  <div id="header" className="text-gray-950 mb-5 w-full">
    <h1 className="font-rubik text-3xl font-semibold mb-3">Dashboard</h1>
    <div className="text-gray-700 flex justify-between items-center">
      <h1 className="text-lg">Home &gt; Dashboard</h1>
      <h5 className="flex items-center text-lg">
        <IoCalendarOutline className="mr-2 text-xl" /> {fechaInicio} -{" "}
        {fechaFin}
      </h5>
    </div>
  </div>

  {/* Contenedor de órdenes */}
  <div className="w-full bg-white rounded-md p-5 flex flex-col h-full overflow-auto text-gray-950">
    {/* Encabezado de tabla */}
    <div className="flex justify-between items-center mb-4">
      <h1 className="font-rubik font-black text-lg">Ordenes</h1>
      <div className="font-rubik ">
        Ordenar por fecha:
        <select
          className="border-none text-sm w-auto rounded-md"
          value={ordenamiento}
          onChange={manejarOrdenamiento}
        >
          <option value="" disabled className="text-gray-600">Seleccionar</option>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>

      </div>
    </div>

    {/* Tabla de órdenes */}
    <div className="overflow-y-auto w-full">
      <table className="w-full table-auto text-sm">
        <thead className="text-gray-400 border-b-2 font-semibold sticky top-0 bg-white z-10">
          <tr>
            <th className="text-left p-4">Orden ID</th>
            <th className="text-left p-4">Fecha</th>
            <th className="text-left p-4">Nombre Cliente</th>
            <th className="text-left p-4">Estado</th>
            <th className="text-left p-4">Total</th>
          </tr>
        </thead>
        <tbody className="text-gray-950">
          {ordenes.length > 0 ? (
            ordenes.map((orden) => (
              <tr
                key={orden.id_factura}
                className="border-b cursor-pointer hover:bg-gray-100"
                onClick={() => detailsClick(orden.id_factura)}
              >
                <td className="p-4">#{orden.codigo_fact}</td>
                <td className="p-4">{orden.fecha_fact}</td>
                <td className="p-4">{orden.nombre}</td>
                <td className="p-4 flex items-center">
                  <GrStatusGoodSmall
                    className="mr-1 text-xs"
                    style={{ color: orden.color }}
                  />
                  {orden.estado_fact}
                </td>
                <td className="p-4">L.200</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-4 text-center" colSpan={5}>
                No hay órdenes disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

        </>
    );
}