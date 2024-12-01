import { Kit } from "@interfaces/kits";
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