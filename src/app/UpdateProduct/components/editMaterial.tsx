import UploadModal from "../../createProduct/components/subirFotos";
import Image from 'next/image';
import React,{useEffect, useState} from "react";
import { ProductoInfo } from "@interfaces/product";
import { fetchProductMaterial } from "../helper/getMaterial";
import { fetchCategoriesMaterials } from "@services/materials";
import { categoriasMateriales } from "@interfaces/materials";
export default function EditMaterial () {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [keywordInput, setkeywordInput] = useState("");
    const [keywords, setkeywords] = useState<string[]>([]);
    const [productoInfo, setProductoInfo] = useState<ProductoInfo["productoInfo"] | null>(null);
    //const [editing, setEditing] = useState(true);

    useEffect(() => {  
      const id = "285"; // ID de prueba
      const loadProductoInfo = async () => {
        const response = await fetchProductMaterial(id);
  
        if (response && response.productoInfo) {
          console.log("Producto recibido:", response.productoInfo);
          setProductoInfo(response.productoInfo);
        } else {
          console.log("No se recibieron datos del producto.");
        }
      };
  
      loadProductoInfo();
    }, []);

    const [galleryImages, setGalleryImages] = useState<string[]>(productoInfo?.imagenes_extra || []);
    const [isGallery, setIsGallery] = useState(false);
    
    useEffect(() => {
      // Si productoInfo cambia y tiene imagenes_extra, actualizar galleryImages
      if (productoInfo?.imagenes_extra) {
        setGalleryImages(productoInfo.imagenes_extra);
      }
    }, [productoInfo]);

    const handleRemoveGalleryImage = (url: string) => {
      setGalleryImages((prevImages) => prevImages.filter((img) => img !== url));
    };

    const [productType, setProductType] = useState<string>("");

    useEffect(() => {
  if (productoInfo) {
    switch (true) {
      case productoInfo?.tallas !== null && productoInfo.tipo_prod === "Producto":
        setProductType("Producto con medidas");
        break;
    
      case productoInfo?.tallas === null && productoInfo?.tipo_prod === "Producto":
        setProductType("Producto con no medidas");
        break;
    
      case productoInfo?.grosores !== null && productoInfo?.tipo_prod === "Material":
        setProductType("Material con grosores");
        break;
    
      case productoInfo?.grosores === null && productoInfo?.tipo_prod === "Material":
        setProductType("Material sin grosor");
        break;
    
      default:
        break;
    }
  }
}, [productoInfo]);
    


  const handleProductTypeChange = (type: string) => {
    setProductType(type);
  };

  const [mainImage, setMainImage] = useState<string | null>(productoInfo?.imagen_principal || null);
  useEffect(() => {
    setMainImage(productoInfo?.imagen_principal || null);
  }, [productoInfo]);


      const handleOpenModal = (forGallery: boolean) => {
        setIsGallery(forGallery);
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => setIsModalOpen(false);
      
      const handleImageUpload = (urls: string[]) => {
        if (isGallery) {
          setGalleryImages(urls);
        } else {
          setMainImage(urls[0] || null);
        }
        handleCloseModal();
      };


      const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
            setkeywords([...keywords, keywordInput.trim()]);
            setkeywordInput("");
          }
        }
      };
    
      const handleKeywordRemove = (keyword: string) => {
        setkeywords((prevKeywords) => prevKeywords.filter((cat) => cat !== keyword));
      };

       // Inicializar el estado de los grosores con la data de productoInfo.grosores
      const [sizes, setSizes] = useState<Record<string, { cantidad: number, precio: number }>>({});

      // Mapeo entre los nombres que vienen del backend y los que queremos mostrar
        const sizeMap: Record<string, string> = {
          "Lace": "LACE",
          "Super fine": "SUPERFINE",
          "Fine": "FINE",
          "Light": "LIGHT",
          "Medium": "MEDIUM",
          "Bulky": "BULKY",
          "Super bulky": "SUPERBULKY",
          "Jumbo": "JUMBO"
        };

         // Actualizar el estado de sizes cuando productoInfo.grosores cambie
          useEffect(() => {
            if (productoInfo?.grosores) {
              setSizes(productoInfo.grosores);
            }
          }, [productoInfo?.grosores]);

        // Lista de grosores predefinidos que queremos mostrar en la interfaz
        const allSizes = ["LACE", "SUPERFINE", "FINE", "LIGHT", "MEDIUM", "BULKY", "SUPERBULKY", "JUMBO"];
          
        const [categories, setCategories] = useState<categoriasMateriales[]>([]);
          const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

          useEffect(() => {
            const getCategories = async () => {
                const fetchedCategories = await fetchCategoriesMaterials();
                setCategories(fetchedCategories);
            };
            getCategories();
        }, []);
        
        const handleCategorySelect = (id: number) => {
          setSelectedCategoryId(id);
          console.log("Selected category ID:", id);
      };
        

    return (
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-koulen mb-6 text-black">Editar Materiales</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" >
  
          {/* Tipo Producto Accordion */}
          <div className="space-y-6">
            <label className="block text-sm font-medium text-black">Tipo Producto</label>
            <div className="flex space-x-4">
            <select
              id="productType"
              value={productType}
              onChange={(e) => handleProductTypeChange(e.target.value)}
              className="p-2 border w text-black rounded-lg w-full"
            >
              <option className="text-black" defaultValue="Material sin grosor">Material sin grosor</option>
              <option defaultValue="Material con grosores">Material con grosor</option>
              <option defaultValue="Producto con no medidas">Producto sin tallas</option>
              <option defaultValue="Producto con medidas">Producto con tallas</option>
            </select>
          </div>
  
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
              <input
                type="text"
                required
                defaultValue={productoInfo?.nombre_prod}
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black"
                placeholder="Escribe el nombre del producto"
              />
            </div>
            {/* Price and Stock */}
            {productType === "Material sin grosor" ? (
              <div>
                <div className="grid grid-cols-2 gap-4 mt-[24px]">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 ">Precio</label>
                          <input
                            type="number"
                            required
                            defaultValue={productoInfo?.precio_venta}
                            className="mt-2 p-2 text-black border border-gray-300 rounded-lg w-full"
                            placeholder="Precio en Lempiras"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                          <input
                            type="number"
                            required
                            defaultValue={productoInfo?.cantidad_disp}
                            className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                            placeholder="Cantidad disponible"
                            min="0"
                          />
                        </div>
                        
                </div>
                {/* Categorías (Carrusel) */}
                <div>
                          <label htmlFor="category" className="block text-sm font-medium mt-[24px] text-gray-700">
                              Categorías
                          </label>
                          <select
                              id="category"
                              value={selectedCategoryId ||""}
                              onChange={(e) => handleCategorySelect(Number(e.target.value))}
                              className="p-2 border w text-black rounded-lg w-full"
                          >
                              <option value={productoInfo?.categorias} >
                                  {productoInfo?.categorias}
                              </option>
                              {categories.map((category) => (
                                  <option key={category.ID_CATEGORIA} value={category.ID_CATEGORIA}>
                                      {category.CATEGORIA}
                                  </option>
                              ))}
                          </select>
                        </div> 
                </div>
                ) : (
                  <div className="mt-4 space-y-4">
                        {allSizes.map((size) => {
                          // Comprobamos si el nombre del tamaño existe en los grosores del backend
                          const backendSize = Object.keys(sizes).find(key => sizeMap[key] === size);

                          return (
                            <div key={size} className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Precio {size}</label>
                                <input
                                  type="number"
                                  className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                                  value={backendSize ? sizes[backendSize]?.precio || 0 : 0} // Si no existe el grosor, ponemos 0
                                  onChange={(e) =>
                                    setSizes((prevSizes) => ({
                                      ...prevSizes,
                                      [backendSize!]: { ...prevSizes[backendSize!], precio: parseFloat(e.target.value) }
                                    }))
                                  }
                                  placeholder="Precio en Lempiras"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Cantidad {size}</label>
                                <input
                                  type="number"
                                  className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                                  value={backendSize ? sizes[backendSize]?.cantidad || 0 : 0} // Si no existe el grosor, ponemos 0
                                  onChange={(e) =>
                                    setSizes((prevSizes) => ({
                                      ...prevSizes,
                                      [backendSize!]: { ...prevSizes[backendSize!], cantidad: parseInt(e.target.value) }
                                    }))
                                  }
                                  placeholder="Cantidad disponible"
                                  min="0"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                          )}
            {/*Marca */}
            <div>
                 <label className="block text-sm font-medium text-gray-700">Marca</label>
                    <textarea
                      required
                      defaultValue={productoInfo?.nombre_marca}
                      className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                      placeholder="Escribe la marca"
                      />
            </div>              
  
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                required
                defaultValue={productoInfo?.descripcion}
                className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                placeholder="Describe el producto"
              />
            </div>
            
            {/* Keywoard Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Keyword</label>
              <input
                type="text"
                defaultValue={keywordInput}
                onChange={(e) => setkeywordInput(e.target.value)}
                onKeyDown={handleKeywordAdd}
                className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                placeholder="Escribe y presiona Enter o Espacio para agregar"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keywords, index) => (
                  <span key={index} className="bg-gray-200 text-black px-2 py-1 rounded-full text-sm flex items-center">
                    {keywords}
                    <button
                      type="button"
                      onClick={() => handleKeywordRemove(keywords)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
  
          {/* Right Column - Image Uploads */}
          <div className="space-y-6">
            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Foto Principal del Producto</label>
              <div
                className="mt-2 border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer"
                onClick={() => handleOpenModal(false)}
              >
                {mainImage ? (
                  <Image src={mainImage} alt="Main Preview" width={250} height={250} className="mx-auto" style={{ width: 'auto', height: 'auto' }}/>
                ) : (
                  <p>Click para cargar imagen principal</p>
                )}
              </div>
            </div>
  
            {/* Gallery Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Galería de Producto</label>
              <div
                className="mt-2 border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer"
                onClick={() => handleOpenModal(true)}
              >
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.map((imgUrl, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={imgUrl}
                          alt={`Gallery Preview ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full max-w-[100px]"
                          style={{ width: 'auto', height: 'auto' }}
                        />
                        <button
                          onClick={() => handleRemoveGalleryImage(imgUrl)}
                          className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Click para cargar imágenes de galería</p>
                )}
              </div>
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="col-span-2 flex justify-end space-x-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={() => {
                
              }}
            >
              Cancelar
            </button>
            <button
                type="button" // Change to "button" to avoid implicit form submission
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                 
              >
                Actualizar
              </button>
  
          </div>
        </form>
  
        {/* Upload Modal */}
        {isModalOpen && (
          <UploadModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onImageUpload={handleImageUpload}
            existingImages={isGallery ? galleryImages : mainImage ? [mainImage] : []}
            isGallery={isGallery}
          />
        )}
      </div>
    )
}