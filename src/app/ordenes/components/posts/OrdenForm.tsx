/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
  total: number;
}

interface EstadoFactura {
  ID_ESTADO_FACT: number;
  ESTADO_FACT: string;
}

export default function Dashboard() {
  // Estado para almacenar las órdenes
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [estados, setEstados] = useState<EstadoFactura[]>([]);
  const [idEstado, setIdEstado] = useState<number | null>(null); // Estado seleccionado por el usuario
  const [direccionOrdenamiento, setDireccionOrdenamiento] = useState<"asc" | "desc" | "">("");

  const detailsClick = (id: number) => {
    localStorage.setItem("ordenSeleccionada", id.toString());
    window.location.href = "/ordenes/details-orden";
  };

  // Función para obtener las órdenes
  const fetchOrdenes = async () => {
    try {
      const body: Record<string, any> = {
        columna_ordenamiento: "FECHA_FACT", // Ordenamiento siempre por fecha
      };

      // Agregar valores según estado o dirección de ordenamiento seleccionados
      if (idEstado) body.idEstado = idEstado;
      if (direccionOrdenamiento) body.direccion_ordenamiento = direccionOrdenamiento;

      const response = await fetch(
        "https://deploybackenddiancrochet.onrender.com/admin/ordenes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener las órdenes");
      }

      const data = await response.json();
      setOrdenes(data.ordenes);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Obtener estados de las facturas
  const fetchEstados = async () => {
    try {
      const response = await fetch(
        "https://deploybackenddiancrochet.onrender.com/admin/estados"
      );

      if (!response.ok) {
        throw new Error("Error al obtener los estados");
      }

      const data = await response.json();
      setEstados(data.estados);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const actualizarRangoFechas = (nuevaFechaInicio: string, nuevaFechaFin: string) => {
    setFechaInicio(nuevaFechaInicio);
    setFechaFin(nuevaFechaFin);
  };
  
  // Simulación: Actualizar rango de fechas
  useEffect(() => {
    // Simula un rango de fechas inicial al cargar el componente
    const rangoInicial = {
      inicio: "2024-11-01",
      fin: "2024-11-30",
    };
    actualizarRangoFechas(rangoInicial.inicio, rangoInicial.fin);
  }, []);
  
  

  // Ejecutar al cargar la página
  useEffect(() => {
    fetchOrdenes();
    fetchEstados();
  }, [idEstado, direccionOrdenamiento]); // Actualizar cuando cambie estado o dirección


    return(
        <>
        <div id="Primary" className="flex flex-col justify-start items-start w-full h-full overflow-auto p-5">
  {/* Encabezado */}
  <div id="header" className="text-gray-950 mb-5 w-full">
    <h1 className="font-rubik text-3xl font-semibold mb-3">Dashboard</h1>
    <div className="text-gray-700 flex justify-between items-center">
      <h1 className="text-lg">Home &gt; Dashboard</h1>
      <h5 className="flex items-center text-lg">
        <IoCalendarOutline className="mr-2 text-xl" />{fechaInicio} -{" "}
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
      <label>Estado: </label>
        <select
        className="border-none bg-gray-100 rounded-md"
          value={idEstado ?? ""}
          onChange={(e) => setIdEstado(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">Todos</option>
          {estados.map((estado) => (
            <option key={estado.ID_ESTADO_FACT} value={estado.ID_ESTADO_FACT}>
              {estado.ESTADO_FACT}
            </option>
          ))}
        </select>
      </div>

      <div className="font-rubik ">
       <label>Dirección de Ordenamiento: </label>
        <select
        className="border-none bg-gray-100 rounded-md"
          value={direccionOrdenamiento}
          onChange={(e) => setDireccionOrdenamiento(e.target.value as "asc" | "desc" | "")}
        >
          <option value="">Sin orden</option>
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
                <td className="p-4">L.{orden.total}</td>
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