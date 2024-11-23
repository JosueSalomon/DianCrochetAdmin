import { Category, ProductWithoutSize, ProductWithSize, InfoProductos } from "@interfaces/product";
import axios from "axios";
const API_URL = "https://deploybackenddiancrochet.onrender.com/admin";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://deploybackenddiancrochet.onrender.com/admin/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.imageUrl; // Devuelve la URL de la imagen cargada
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error uploading file');
  }
};

export const updateProfilePic = async (correo: string, imageUrl: string) => {
  try {
    const response = await fetch(`https://deploybackenddiancrochet.onrender.com/user/actualizar/foto/${correo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nueva_url_imagen: imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile picture');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw new Error('Error updating profile picture');
  }
};

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

const BASE_URL = "https://deploybackenddiancrochet.onrender.com/admin/create/producto";

export const createProductWithSize = async (product: ProductWithSize) => {
  try {
    const response = await axios.post(`${BASE_URL}/contalla`, product);
    console.log("Producto con talla creado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear producto con talla:", error);
    throw error;
  }
};

export const createProductWithoutSize = async (product: ProductWithoutSize) => {
  try {
    const response = await axios.post(`${BASE_URL}/sintalla`, product);
    console.log("Producto sin talla creado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear producto sin talla:", error);
    throw error;
  }
};

export const getProducts = async(): Promise<InfoProductos[]> =>{
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) {
    throw new Error("Error al traer productos");
  }
  const data = await res.json();
  return data.productos;
}

export const getProductosPorTipo = async (id: number): Promise<InfoProductos[]> => {
  try {
    const response = await fetch(`${API_URL}/prodcutos/categoria/${id}`);
    const data = await response.json();
    return data.productosConCategoria; 
  } catch (error) {
    console.error('Error al obtener productos por tipo:', error);
    return []; 
  }
};

export const deleteProduct = async (id: number, correo: string | null) => {
  console.log(id, correo)
  const res = await fetch(`${API_URL}/delete/producto/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo }), 
  });

  if (!res.ok) {
    throw new Error("Error al eliminar el producto");
  }

  const data = await res.json();
  return data; 
};

