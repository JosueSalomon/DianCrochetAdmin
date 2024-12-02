import { Kit, KitUpdate, ProductoInfo } from "@interfaces/kits";
import { Category } from "@interfaces/product";
import axios from "axios";

// Función para obtener las categorías
export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch('https://deploybackenddiancrochet.onrender.com/producto/categorias');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data.categorias as Category[];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
  };

  const BASE_URL = "https://deploybackenddiancrochet.onrender.com/admin/create/kit";

  export const createKit = async (product: Kit) => {
    try {
      const response = await axios.post(`${BASE_URL}`,product);
      console.log("Kit creado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear el kit", error);
      throw error;
    }
  };



  export const updateKit = async (
    id: string,
    productData: KitUpdate
  ): Promise<boolean> => {
    try {
      const response = await fetch(`https://deploybackenddiancrochet.onrender.com/admin/update/kit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        console.error("Error actualizando Kit", response.statusText);
        return false;
      }
  
      return true;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return false;
    }
  };

  export const fetchKit = async (id: string): Promise<ProductoInfo | null> => {
    try {
      const response = await fetch(`https://deploybackenddiancrochet.onrender.com/admin/get/producto/${id}`);
      const data = await response.json();
  
      if (data?.productoInfo) {
        return data; // Devuelve el JSON completo
      } else {
        console.error("No se encontró información del productoInfo en la respuesta.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener los datos del productoInfo:", error);
      return null;
    }
  };