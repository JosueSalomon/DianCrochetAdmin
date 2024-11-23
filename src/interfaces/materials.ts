export interface categoriasMateriales {
    ID_CATEGORIA: number;
    CATEGORIA: string;
}
export interface MaterialWithoutTalla {
    productName: string;
    description: string;
    price: number | null; // Puede ser null si no se proporciona
    stock: number | null; // Puede ser null si no se proporciona
    mainImage: string | null;
    galleryImages: string[] | null;
    keywords: string[] | null;
    categoryId: number | null; // Puede ser null si no se selecciona una categoría
    marca: string;
    
  }

  export interface MaterialWithTalla {
    productName: string;
    description: string;
    sizePrices: Record<string, number | null>; // Precios por grosor (LACE, SUPERFINE, etc.)
    sizeQuantities: Record<string, number | null>; // Cantidades por grosor
    mainImage: string | null;
    galleryImages: string[] | null;
    keywords: string[] | null;
    categoryId: number; // ID de la categoría siempre debe estar definido
    marca: string;
  }

  export interface MaterialWithoutTallaUpdate {
    id:string;
    productName: string;
    description: string;
    price: number | null; // Puede ser null si no se proporciona
    stock: number | null; // Puede ser null si no se proporciona
    mainImage: string | null;
    galleryImages: string[] | null;
    keywords: string[] | null;
    categoryId: number | null; // Puede ser null si no se selecciona una categoría
    marca: string;
  }

  export interface MaterialWithTallaUpdate {
    id:string;
    productName: string;
    description: string;
    sizePrices: Record<string, number | null>; // Precios por grosor (LACE, SUPERFINE, etc.)
    sizeQuantities: Record<string, number | null>; // Cantidades por grosor
    mainImage: string | null;
    galleryImages: string[] | null;
    keywords: string[] | null;
    categoryId: number; // ID de la categoría siempre debe estar definido
    marca: string;
  }
  export interface ProductoInfo {
    productoInfo: {
      id_producto: string;
      nombre_prod: string;
      precio_venta: number;
      descripcion: string;
      cantidad_disp: number;
      tipo_prod: string;
      color: string;
      tallas: Record<string, { cantidad: number; precio: number }>;
      grosores: Record<string, { cantidad: number; precio: number }>;
      imagen_principal: string;
      imagenes_extra: string[];
      nombre_marca: string;
      categorias:string[];
      keywords: string[] | null;
    };
  }
  