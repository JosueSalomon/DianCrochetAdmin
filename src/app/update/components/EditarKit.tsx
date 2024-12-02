import UploadModal from "../../createProduct/components/subirFotos";
import Image from 'next/image';
import React,{useEffect, useState, useRef} from "react";
import { ProductoInfo } from "@interfaces/product";

import { fetchCategories } from "@services/product";
import { Category } from "@interfaces/product"; 
import { fetchKit } from "@services/kits";
import Modal from "./modal";
import SubirPdf from "./subirPdf";
import { KitUpdate } from "@interfaces/kits";
import { updateKit } from "@services/kits";



interface EditarMaterialProps {
  id: string; // Declara que el componente espera una prop `id` de tipo string
}
export default function EditarKit ({ id }: EditarMaterialProps) {
    
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[] | null>(null);
  const [productoInfo, setProductoInfo] = useState<ProductoInfo["productoInfo"] | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>(productoInfo?.imagenes_extra || []);
  const [isGallery, setIsGallery] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(productoInfo?.imagen_principal || null);
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [buttonColor, setButtonColor] = useState<string>("bg-gray-200");
  const [editableProduct, setEditableProduct] = useState(productoInfo);
  const [productType, setProductType] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const formattedKeywords = keywords && keywords.length > 0 ? keywords : null; // Asegurarse que sea null si está vacío
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfKit, setPdfKit] = useState<string | null>(productoInfo?.url_patron || null);; 
  const handleOpenPdfModal = () => setIsPdfModalOpen(true);
      // Función para cerrar el modal del PDF
      const handleClosePdfModal = () => setIsPdfModalOpen(false);

      // Función para manejar la URL del PDF cargado
      const handlePdfUpload = (url: string) => {
        setPdfKit(url);
        handleClosePdfModal();
      };
  
  
  useEffect(() => {   
      const loadProductoInfo = async () => {
        const response = await fetchKit(id);
  
        if (response && response.productoInfo) {
          console.log("Producto recibido:", response.productoInfo);
          setProductoInfo(response.productoInfo);
        } else {
          console.log("No se recibieron datos del producto.");
        }
      };
  
      loadProductoInfo();
    }, [id]);

   
  
    const handleRemoveGalleryImage = (url: string) => {
      setGalleryImages((prevImages) => prevImages.filter((img) => img !== url));
    };

      // Sincronizar las palabras clave iniciales desde editableProduct
      useEffect(() => {
        if (editableProduct?.keywords) {
          setKeywords(editableProduct.keywords);
        } else {
          setKeywords(null);
        }
      }, [editableProduct]);
    

  
    useEffect(() => {
  if (productoInfo) {
    switch (true) {
      case productoInfo?.tallas == null && productoInfo.grosores == null && productoInfo.tipo_prod === "Kit":
        setProductType("Kit");
        break;
    
      default:
        break;
    }
  }
}, [productoInfo]);
    
  const handleProductTypeChange = (type: string) => {
    setProductType(type);
  };

 
  
  useEffect(() => {
    if (productoInfo) {
      setGalleryImages(productoInfo.imagenes_extra || []);
      setMainImage(productoInfo.imagen_principal || null);
      setPdfKit(productoInfo.url_patron || null);
      
    }
  }, [productoInfo]);

      const handleOpenModal = (forGallery: boolean) => {
        if (!isDisabled) {
        setIsGallery(forGallery);
        setIsModalOpen(true);
        }
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
          const trimmedInput = keywordInput.trim();
          if (trimmedInput && (!keywords || !keywords.includes(trimmedInput))) {
            setKeywords((prev) => (prev ? [...prev, trimmedInput] : [trimmedInput]));
            setKeywordInput(""); // Limpiar el input después de agregar
          }
        }
      };
    
    
      const handleKeywordRemove = (keyword: string) => {
        setKeywords((prevKeywords) => {
          // Filtrar las palabras clave
          const updatedKeywords = prevKeywords?.filter((k) => k !== keyword);
      
          // Actualizar editableProduct en base a las palabras clave actualizadas
          setEditableProduct((prev) =>
            prev
              ? {
                  ...prev,
                  keywords: updatedKeywords && updatedKeywords.length > 0 ? updatedKeywords : null,
                }
              : null
          );
      
          // Retornar las palabras clave actualizadas, o null si el arreglo está vacío
          return updatedKeywords && updatedKeywords.length > 0 ? updatedKeywords : null;
        });
      };
      
        // Obtener las categorías desde el backend
        useEffect(() => {
          const getProductCategories = async () => {
            const fetchedCategories = await fetchCategories(); // Supongamos que fetchCategories devuelve [{ ID_CATEGORIA, CATEGORIA }]
            setProductCategories(fetchedCategories);
          };
          getProductCategories();
        }, []);
      
        // Inicializar las categorías seleccionadas usando los nombres de las categorías
        useEffect(() => {
          if (productoInfo?.categorias && productoInfo.categorias.length > 0) {
            setSelectedCategoryNames(productoInfo.categorias); // Usamos los nombres directamente
          }
        }, [productoInfo]);
      
        // Cerrar el menú al hacer clic fuera
        useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setIsDropdownOpen(false);
            }
          };
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, []);
      
        // Manejar la selección/deselección de categorías
        const handleCategoryToggle = (categoryName: string) => {
          setSelectedCategoryNames((prevSelected) =>
            prevSelected.includes(categoryName)
              ? prevSelected.filter((name) => name !== categoryName) // Deseleccionar
              : [...prevSelected, categoryName] // Seleccionar
          );
        };
          
        
        const handleEdit = () => {
          setIsEditing((prev) => !prev);
          setIsDisabled(false); // Al hacer clic en "Editar", habilitar los inputs
          setButtonColor(buttonColor === "bg-gray-200" ? "bg-purple-400" : "bg-gray-200");
        };

        const handleCancel = () => {
          setIsDisabled(true); // Al hacer clic en "Editar", habilitar los inputs
          setButtonColor(buttonColor === "bg-gray-200" ? "bg-purple-400" : "bg-gray-200");
          window.location.href = "https://diancrochet-administrador.vercel.app/productos";
        };
          
        useEffect(() => {
          if (productoInfo) {
            setEditableProduct({ ...productoInfo });
          }
        }, [productoInfo]);
      
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setEditableProduct((prev) => {
            if (!prev) return prev; // Si no hay datos iniciales, evita actualizar
            return {
              ...prev,
              [name]: value,
            };
          });
        };
      
        const handleUpdate = async () => {
          if (!mainImage) {
            alert("Debes cargar una imagen principal antes de continuar.");
            return; // Detén la ejecución si no hay imagen
          }
          if (!editableProduct) return;
          
      
          const selectedCategoryIds = selectedCategoryNames.map((name) => {
            const category = productCategories.find((cat) => cat.CATEGORIA === name);
            return category ? category.ID_CATEGORIA : null;
          }).filter((id): id is number => id !== null);
    
           {
            const productData: KitUpdate = {
              id: editableProduct.id_producto,
              nombre_prod: editableProduct.nombre_prod,
              descripcion: editableProduct.descripcion,
              categorias: selectedCategoryIds.map((id) => id.toString()),
              precio: editableProduct.precio_venta,
              cantidad_total: editableProduct.cantidad_disp,
              url_imagen_principal: mainImage || "",
              url_imagen_miniaturas: galleryImages.length > 0 ? galleryImages : null,
              keywords: formattedKeywords,
              url_patron: pdfKit || "",
            };
            console.log("Objeto que se envía para Producto sin medidas:", productData);
      
            const success = await updateKit(editableProduct.id_producto, productData);
            
            if (success) {
              window.location.reload();
            } else {
              console.error("Error actualizando producto sin medidas.");
            }
          }
        };

        
        
    return (
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-koulen mb-6 text-black">
        {isEditing ? `Editar Producto  ${productoInfo?.nombre_prod}` : productoInfo?.nombre_prod}
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" >
  
          {/* Tipo Producto Accordion */}
          <div className="space-y-6">
            <label className="block text-sm font-medium text-black">Tipo Producto</label>
            <div className="flex space-x-4">
            <select
              
              id="productType"
              defaultValue={productType}
              onChange={(e) => handleProductTypeChange(e.target.value)}
              className="p-2 border w text-black rounded-lg w-full"
              disabled
            >
              <option className="text-black" value="Kit">Kit</option>
              
            </select>
          </div>
            
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
              <input
                type="text"
                name="nombre_prod"
                required
                value={editableProduct?.nombre_prod}
                onChange={handleInputChange}
                disabled={isDisabled}
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black"
                placeholder="Escribe el nombre del producto"
              />
            </div>
            {/* Categorías (Carrusel) */}
            <div className="relative text-start" ref={dropdownRef}>
                <label htmlFor="productCategories" className="block text-sm font-medium text-gray-700">
                  Categorías de Productos
                </label>
                <button
                  disabled={isDisabled}
                  type="button"
                  className="w-full p-2 bg-white text-start rounded-lg border text-black mt-[8px]"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedCategoryNames.length > 0
                    ? `Seleccionadas (${selectedCategoryNames.length})`
                    : "Selecciona categorías"}
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border">
                    <div className="max-h-60 overflow-y-auto p-2">
                      {productCategories.map((category) => (
                        <div key={category.ID_CATEGORIA} className="flex items-center space-x-2 p-1">
                          <input
                            name=""
                            type="checkbox"
                            id={`product-${category.ID_CATEGORIA}`}
                            value={category.CATEGORIA}
                            checked={selectedCategoryNames.includes(category.CATEGORIA)}
                            onChange={() => handleCategoryToggle(category.CATEGORIA)}
                            className="text-black"
                          />
                          <label htmlFor={`product-${category.ID_CATEGORIA}`} className="text-black">
                            {category.CATEGORIA}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
               {/* Price and Stock */}
              <div>
                <div className="grid grid-cols-2 gap-4 mt-[24px]">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 ">Precio</label>
                          <input
                            type="number"
                            name="precio_venta"
                            required
                            disabled={isDisabled}
                            value={editableProduct?.precio_venta}
                            onChange={handleInputChange}
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
                            name="cantidad_disp"
                            disabled={isDisabled}
                            value={editableProduct?.cantidad_disp}
                            onChange={handleInputChange}
                            className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                            placeholder="Cantidad disponible"
                            min="0"
                          />
                        </div>
                        
                </div>            
  
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                required
                name="descripcion"
                disabled={isDisabled}
                value={editableProduct?.descripcion}
                onChange={handleInputChange}
                className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                placeholder="Describe el producto"
              />
            </div>
            
            {/* Keywoard Input */}
            <div>
            <label className="block text-sm font-medium text-gray-700">Keyword</label>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordAdd}
                  disabled={isDisabled}
                  className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                  placeholder="Escribe y presiona Enter o Espacio para agregar"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords?.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-black px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isDisabled) handleKeywordRemove(keyword);
                        }}
                        disabled={isDisabled}
                        className={`ml-2 ${
                          isDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:text-red-700"
                        }`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          </div>
              </div>
              
  
          {/* Right Column - Image Uploads */}
          <div className="space-y-6">
            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Foto Principal del Producto</label>
              <div
                className={`mt-2 border-dashed border-2 p-4 text-center cursor-pointer ${isDisabled ? "border-gray-400 bg-gray-200 cursor-not-allowed pointer-events-none" : "border-gray-300"}`}
                
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
                className={`mt-2 border-dashed border-2 p-4 text-center cursor-pointer ${isDisabled ? "border-gray-400 bg-gray-200 cursor-not-allowed pointer-events-none" : "border-gray-300"}`}
                onClick={() => handleOpenModal(true) }
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

              <div>
          <div>
            <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Tutorial del Kit/PDF</label>
                <div
                className={`mt-2 border-dashed border-2 p-4 text-center cursor-pointer ${isDisabled ? "border-gray-400 bg-gray-200 cursor-not-allowed pointer-events-none" : "border-gray-300"}`}
                onClick={handleOpenPdfModal} // Abrir el modal
                >
                {pdfKit ? (
                    <p className="text-sm text-gray-600">Archivo subido</p>
                ) : (
                    <p>Click para cargar el PDF</p>
                )}
                </div>
            </div>
            {/* Modal exclusivo para cargar el PDF */}
            <Modal isVisible={isPdfModalOpen} onClose={handleClosePdfModal}>
              
                <SubirPdf
                onSubmit={handlePdfUpload}
                initialUploadedFileUrl={pdfKit}
                nombre_prod={productoInfo?.nombre_prod|| "" } // Pasar la URL del archivo cargado
                />
            </Modal>
          </div>
            </div>
            </div>
          </div>

  
          {/* Action Buttons */}
          <div className="col-span-2 flex justify-end space-x-3 mt-4">

          <button
              onClick={handleEdit}
              type="button"
              className={" px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-purple-400"}
            >
              Editar
            </button>


            <button
                type="button" // Change to "button" to avoid implicit form submission
                disabled={!mainImage}
              className={`px-4 py-2 rounded-lg ${
                mainImage
                  ? "bg-gray-200 text-gray-700 rounded-lg hover:bg-purple-400"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
                onClick={handleUpdate} 
              >
                Actualizar
              </button>


            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-purple-400"
              onClick={handleCancel}
            
            >
              Volver
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