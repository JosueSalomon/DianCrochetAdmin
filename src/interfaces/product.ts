export interface Category {
    ID_CATEGORIA: number;
    CATEGORIA: string;
}
export interface ProductWithSize {
    productName: string;
    description: string;
    categories: number[];
    mainImage: string;
    galleryImages: string[] | null;
    sizeQuantities: Record<string, number | null>;
    sizePrices: Record<string, number | null>;
    keywords: string[] | null;
  }
  
  export interface ProductWithoutSize {
    productName: string;
    price: number;
    stock: number;
    description: string;
    categories: string[];
    mainImage: string;
    galleryImages: string[] | null;
    keywords: string[] | null;
  }

  export interface Product {
    id_producto: number;
    nombre_prod: string;
    precio_venta: number;
    descripcion: string;
    cantidad_disp: number | null;
    tipo_prod: string;
    color: string | null;
    tallas: string | null;
    grosores: Record<string, { cantidad: number; precio: number }>;
    imagen_principal: string;
    imagenes_extra: string[] | null;
    nombre_marca: string;
  }

  export interface Grosor {
    cantidad: number | null;
    precio: number | null;
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
      imagenes_extra: string[] | null;
      nombre_marca: string;
      categorias:string[];
      keywords: string[] | null;
    };
  }

  export interface ProductWithSizeUpdate {
    id:string;
    productName: string;
    description: string;
    categories: number[];
    mainImage: string;
    galleryImages: string[] | null;
    sizeQuantities: Record<string, number | null>;
    sizePrices: Record<string, number | null>;
    keywords: string[] | null;
  }
  
  export interface ProductWithoutSizeUpdate {
    id:string;
    productName: string;
    price: number;
    stock: number;
    description: string;
    categories: string[];
    mainImage: string;
    galleryImages: string[] | null;
    keywords: string[] | null;
  }
export interface InfoProductos{
    id_producto: number;
    nombre_prod: string;
    precio_venta: number;
    color: string;
    cantidad_vendida: number;
    cantidad_disp: number;
    url_imagen: string;
    id_estado_fact: number | null;
}
