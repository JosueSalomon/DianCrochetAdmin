
export interface Kit {
    nombre_prod: string;
    precio: number;
    cantidad_total: number;
    descripcion: string;
    categorias: number[];
    keywords?: string[] | null; 
    url_imagen_principal: string;
    url_imagen_miniaturas?: string[] | null; 
    url_patron: string;
    url_tutorial:string;
  }

export interface Category {
    ID_CATEGORIA: number;
    CATEGORIA: string;
}  

export interface KitUpdate {
  id:string;
  nombre_prod: string;
  precio: number;
  cantidad_total: number;
  descripcion: string;
  categorias:string[];
  keywords?: string[] | null; 
  url_imagen_principal: string;
  url_imagen_miniaturas?: string[] | null; 
  url_patron: string;
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
    url_patron:string | null;
  };
}