
export interface Kit {
    nombre_prod: string;
    precio: number;
    cantidad_total: number;
    descripcion: string;
    categorias: number[];
    keywords?: string[] | null; // Puede ser un array de strings o nulo
    url_imagen_principal: string;
    url_imagen_miniaturas?: string[] | null; // Puede ser un array de strings o nulo
    url_tutorial: string;
  }

export interface Category {
    ID_CATEGORIA: number;
    CATEGORIA: string;
}  