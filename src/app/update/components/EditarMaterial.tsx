import UploadModal from "../../createProduct/components/subirFotos";
import Image from 'next/image';
import React,{useEffect, useState} from "react";
import { ProductoInfo } from "@interfaces/product";
import { fetchProductMaterial } from "../helper/UpdateMaterial";
import { fetchCategoriesMaterials } from "@services/materials";
import { categoriasMateriales } from "@interfaces/materials";
import { MaterialWithTallaUpdate, MaterialWithoutTallaUpdate } from "@interfaces/materials";
import { updateMaterialWithSize, updateMaterialWithoutSize } from "../helper/UpdateMaterial";


interface EditarMaterialProps {
  id: string; // Declara que el componente espera una prop `id` de tipo string
}

export default function EditarMaterial ({ id }: EditarMaterialProps) {
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [keywordInput, setKeywordInput] = useState("");
    const [keywords, setKeywords] = useState<string[] | null>(null);
    const [productoInfo, setProductoInfo] = useState<ProductoInfo["productoInfo"] | null>(null);
    const [galleryImages, setGalleryImages] = useState<string[]>(productoInfo?.imagenes_extra || []);
    const [isGallery, setIsGallery] = useState(false);
    const [mainImage, setMainImage] = useState<string | null>(productoInfo?.imagen_principal || null);
    // Inicializar el estado de los grosores con la data de productoInfo.grosores
    const [, setSizes] = useState<Record<string, { cantidad: number, precio: number }>>({});
    //const [editing, setEditing] = useState(true);
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
    // Lista de grosores predefinidos que queremos mostrar en la interfaz
    const allSizes = ["LACE", "SUPERFINE", "FINE", "LIGHT", "MEDIUM", "BULKY", "SUPERBULKY", "JUMBO"];
    const [categories, setCategories] = useState<categoriasMateriales[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [productType, setProductType] = useState<string>("");
    const [buttonColor, setButtonColor] = useState<string>("bg-gray-200");
    const [editableProduct, setEditableProduct] = useState(productoInfo);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
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
    }, [id]);

    const handleRemoveGalleryImage = (url: string) => {
      setGalleryImages((prevImages) => prevImages.filter((img) => img !== url));
    };
    
    useEffect(() => {
      // Si productoInfo cambia y tiene imagenes_extra, actualizar galleryImages
      if (productoInfo?.imagenes_extra) {
        setGalleryImages(productoInfo.imagenes_extra);
      }
    }, [productoInfo]);

  
    useEffect(() => {
  if (productoInfo) {
    switch (true) {
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
      

      // Sincronizar las palabras clave iniciales desde editableProduct
      useEffect(() => {
        if (editableProduct?.keywords) {
          setKeywords(editableProduct.keywords);
        } else {
          setKeywords(null);
        }
      }, [editableProduct]);

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
          const updatedKeywords = prevKeywords?.filter((k) => k !== keyword) || null;
          setEditableProduct((prev) =>
            prev
              ? {
                  ...prev,
                  keywords: updatedKeywords,
                }
              : null
          );
      
          return updatedKeywords && updatedKeywords.length > 0 ? updatedKeywords : null;
        });
      };

         // Actualizar el estado de sizes cuando productoInfo.grosores cambie
          useEffect(() => {
            if (productoInfo?.grosores) {
              setSizes(productoInfo.grosores);
            }
          }, [productoInfo?.grosores]);

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

      const handleEdit = () => {
        setIsEditing(!isEditing); 
        setIsDisabled(false); // Al hacer clic en "Editar", habilitar los inputs
        setButtonColor(buttonColor === "bg-gray-200" ? "bg-purple-400" : "bg-gray-200");
      };

      const handleCancel = () => {
        setIsDisabled(true); // Al hacer clic en "Editar", habilitar los inputs
        setButtonColor(buttonColor === "bg-gray-200" ? "bg-purple-400" : "bg-gray-200");
      };
      
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

      useEffect(() => {
        if (productoInfo) {
          setEditableProduct({ ...productoInfo });
        }
      }, [productoInfo]);
      
      const handleUpdate = async () => {
        if (!mainImage) {
          alert("Debes cargar una imagen principal antes de continuar.");
          return; // Detén la ejecución si no hay imagen
        }
        if (!editableProduct) return;
        
        if (productType === "Material con grosores") {
          const productData: MaterialWithTallaUpdate = {
            id: editableProduct.id_producto,
            sizeQuantities: Object.fromEntries(
              Object.keys(editableProduct.grosores || {}).map((key) => [
                key,
                editableProduct.grosores![key].cantidad,
              ])
            ),
            sizePrices: Object.fromEntries(
              Object.keys(editableProduct.grosores || {}).map((key) => [
                key,
                editableProduct.grosores![key].precio,
              ])
            ),
            productName: editableProduct.nombre_prod,
            description: editableProduct.descripcion,
            categoryId: 4,
            mainImage: mainImage || "",
            galleryImages: galleryImages.length > 0 ? galleryImages : null,
            keywords: keywords,
            marca:editableProduct.nombre_marca,
          };
          console.log("Objeto que se envía para Producto con medidas:", productData);
          const success = await updateMaterialWithSize(editableProduct.id_producto, productData);
          
          window.location.reload();
          if (success) {
            console.log("Producto con medidas actualizado correctamente.");
          } else {
            console.error("Error actualizando producto con medidas.");
          }
        } else {
          const productData: MaterialWithoutTallaUpdate = {
            id: editableProduct.id_producto,
            productName: editableProduct.nombre_prod,
            description: editableProduct.descripcion,
            categoryId: selectedCategoryId,
            price: editableProduct.precio_venta,
            stock: editableProduct.cantidad_disp,
            mainImage: mainImage || "",
            galleryImages: galleryImages.length > 0 ? galleryImages : null,
            keywords: keywords,
            marca:editableProduct.nombre_marca,
          };
          console.log("Objeto que se envía para Producto sin medidas:", productData);
    
          const success = await updateMaterialWithoutSize(editableProduct.id_producto, productData);
          window.location.reload();
          if (success) {
            console.log("Producto sin medidas actualizado correctamente.");
          } else {
            console.error("Error actualizando producto sin medidas.");
          }
        }
      };

    return (
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-koulen mb-6 text-black">
        {isEditing ? `Editar Material ${productoInfo?.nombre_prod}` : productoInfo?.nombre_prod}
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
              <option className="text-black" defaultValue="Material sin grosor">Material con grosor</option>
              <option defaultValue="Material con grosores">Material sin grosor</option>
            </select>
          </div>
  
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
              <input
                type="text"
                name="nombre_prod"
                required
                defaultValue={editableProduct?.nombre_prod}
                onChange={handleInputChange}
                disabled={isDisabled}
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
                            name="precio_venta"
                            required
                            value={editableProduct?.precio_venta}
                            onChange={handleInputChange}
                            disabled={isDisabled}
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
                            name="cantidad_disp"
                            required
                            disabled={isDisabled}
                            value={editableProduct?.cantidad_disp}
                            onChange={handleInputChange}
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
                              defaultValue={selectedCategoryId ||""}
                              disabled={isDisabled}
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
                          const backendSize = Object.keys(sizeMap).find(key => sizeMap[key] === size);

                          return (
                            <div key={size} className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Precio {size}</label>
                                <input
                                  type="number"
                                  disabled={isDisabled}
                                  name={`precio_${size}`}
                                  className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                                  value={
                                    backendSize
                                      ? editableProduct?.grosores?.[backendSize]?.precio || ""
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const newPrecio = parseFloat(e.target.value) || 0;
      
                                    setEditableProduct((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            grosores: {
                                              ...prev.grosores,
                                              [backendSize!]: {
                                                ...prev.grosores[backendSize!],
                                                precio: newPrecio,
                                              },
                                            },
                                          }
                                        : null
                                    );
                                  }}
                                  placeholder="Precio en Lempiras"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Cantidad {size}</label>
                                <input
                                  type="number"
                                  name={`cantidad_${size}`}
                                  disabled={isDisabled}
                                  className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                                  value={
                                    backendSize
                                      ? editableProduct?.grosores?.[backendSize]?.cantidad || ""
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const newCantidad = parseInt(e.target.value) || 0;
      
                                    setEditableProduct((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            grosores: {
                                              ...prev.grosores,
                                              [backendSize!]: {
                                                ...prev.grosores[backendSize!],
                                                cantidad: newCantidad,
                                              },
                                            },
                                          }
                                        : null
                                    );
                                  }}
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
                      disabled={isDisabled}
                      name="nombre_marca"
                      defaultValue={editableProduct?.nombre_marca}
                      onChange={handleInputChange}
                      className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                      placeholder="Escribe la marca"
                      />
            </div>              
  
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                required
                disabled={isDisabled}
                name="descripcion"
                defaultValue={editableProduct?.descripcion}
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
                        onClick={() => handleKeywordRemove(keyword)}
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
                type="button" // Change to "button" to avoid implicit form submission
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-purple-400"
                onClick={handleEdit}
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
                type="button" // Change to "button" to avoid implicit form submission
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-purple-400"
                onClick={handleCancel}
              >
                Cancelar
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