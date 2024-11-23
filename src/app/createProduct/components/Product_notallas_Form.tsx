import React, { useState, useRef,useEffect } from "react";
import { fetchCategories } from "@services/product";
import UploadModal from "./subirFotos";
import Image from 'next/image';
import { createProductWithSize, createProductWithoutSize } from "@services/product";
import { Category, ProductWithSize,ProductWithoutSize } from "@interfaces/product";

const ProductForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productType, setProductType] = useState("Producto sin talla");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGallery, setIsGallery] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [keywordInput, setkeywordInput] = useState("");
  const [keywords, setkeywords] = useState<string[] | null>([]); 

  // Estados para manejar las categorías y el menú
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const formattedKeywords = keywords && keywords.length > 0 ? keywords : null;
    // Carga de categorías
    useEffect(() => {
      const getCategories = async () => {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
        console.log(fetchedCategories)
      };
      getCategories();
      
    }, []);

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
    
    // Agregar o quitar categorías seleccionadas
    const handleCategoryToggle = (id: number) => {
      setSelectedCategoryIds((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((categoryId) => categoryId !== id)
          : [...prevSelected, id]
      );
    };

  // Size-specific states for "Producto con talla"
  const [sizePrices, setSizePrices] = useState({
    XL: "",
    L: "",
    M: "",
    S: "",
    XS: "",
  });
  const [sizeQuantities, setSizeQuantities] = useState({
    XL: "",
    L: "",
    M: "",
    S: "",
    XS: "",
  });
	
  const handleRemoveGalleryImage = (url: string) => {
    setGalleryImages((prevImages) => prevImages.filter((img) => img !== url));
  };
  const handleProductTypeChange = (type: string) => setProductType(type);

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
      const trimmedInput = keywordInput.trim();
  
      if (trimmedInput && (!keywords || !keywords.includes(trimmedInput))) {
        setkeywords((prevKeywords) =>
          prevKeywords ? [...prevKeywords, trimmedInput] : [trimmedInput]
        );
        setkeywordInput("");
      }
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setkeywords((prevKeywords) => {
      if (!prevKeywords) return null; // Si ya es null, mantener null
      const updatedKeywords = prevKeywords.filter((k) => k !== keyword);
      return updatedKeywords.length > 0 ? updatedKeywords : null; // Volver a null si el arreglo queda vacío
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isCreatingProduct) {
      console.log("isCreatingProduct flag is false, skipping submission");
      return;
    }
  
    try {
      if (productType === "Producto con talla") {
        const newProduct: ProductWithSize = {
          productName,
          description,
          categories: selectedCategoryIds,
          mainImage: mainImage || "",
          galleryImages: galleryImages.length > 0 ? galleryImages : null,
          sizePrices: {
            ...Object.fromEntries(
              Object.entries(sizePrices).map(([size, price]) => [size, price === "0" || price.trim() === "" ? null : parseFloat(price)])
            ),
          },
          sizeQuantities: {
            ...Object.fromEntries(
              Object.entries(sizeQuantities).map(([size, quantity]) => [size, quantity === "0" || quantity.trim() === "" ? null : parseInt(quantity, 10)])
            ),
          },
          keywords: formattedKeywords,
        };
        console.log("Enviando producto con talla:", newProduct);
        const response = await createProductWithSize(newProduct);
        console.log("Respuesta del servidor (con talla):", response);
      } else {
        const newProduct: ProductWithoutSize = {
          productName,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          description,
          categories: selectedCategoryIds.map((id) => id.toString()),
          mainImage: mainImage || "",
          galleryImages:galleryImages.length > 0 ? galleryImages : null,
          keywords: formattedKeywords,
        };
        console.log("Enviando producto sin talla:", newProduct);
        const response = await createProductWithoutSize(newProduct);
        console.log("Respuesta del servidor (sin talla):", response);
      }
  
      // Resetea el formulario tras la creación exitosa
      setIsCreatingProduct(false);
      resetForm();
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  const handleCreateProduct = () => {
    if (!mainImage) {
      alert("Debes cargar una imagen principal antes de continuar.");
      return; // Detén la ejecución si no hay imagen
    }
  
    console.log("Create button clicked, setting isCreatingProduct to true");
    setIsCreatingProduct(true);
    formRef.current?.requestSubmit(); // Envía el formulario si pasa la validación
  };

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setPrice("");
    setStock("");
    setMainImage(null);
    setGalleryImages([]);
    setkeywords([]);
    setSizePrices({ XL: "", L: "", M: "", S: "", XS: "" });
    setSizeQuantities({ XL: "", L: "", M: "", S: "", XS: "" });
    setSelectedCategoryIds([]);

  };


  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-koulen mb-6 text-black">Agregar Nuevo Producto</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={formRef} onSubmit={handleFormSubmit}>

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
              <option className="text-black" value="Producto sin talla">Producto sin talla</option>
              <option value="Producto con talla">Producto con talla</option>
            </select>
          </div>
          
          {/* Categorías (Carrusel) */}
          <div className="relative text-start" ref={dropdownRef}>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                Categorías
              </label>
              <button
                type="button"
                className="w-full p-2 bg-white text-start rounded-lg border text-black mt-[8px]"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedCategoryIds.length > 0
                  ? `Seleccionadas (${selectedCategoryIds.length})`
                  : "Selecciona categorías"}
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-lg ">
                  <div className="max-h-60 overflow-y-auto p-2">
                    {categories.map((category) => (
                      <div key={category.ID_CATEGORIA} className="flex items-center space-x-2 p-1">
                        <input
                          type="checkbox"
                          id={`category-${category.ID_CATEGORIA}`}
                          value={category.ID_CATEGORIA}
                          checked={selectedCategoryIds.includes(category.ID_CATEGORIA)}
                          onChange={() => handleCategoryToggle(category.ID_CATEGORIA)}
                          className="text-black"
                        />
                        <label htmlFor={`category-${category.ID_CATEGORIA}`} className="text-black">
                          {category.CATEGORIA}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black"
              placeholder="Escribe el nombre del producto"
            />
          </div>

          {/* Price and Stock */}
          {productType === "Producto sin talla" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
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
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                  placeholder="Cantidad disponible"
                  min="0"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {["XL", "L", "M", "S", "XS"].map((size) => (
                <div key={size} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Precio {size}</label>
                    <input
                      type="number"
                      value={sizePrices[size as keyof typeof sizePrices]}
                      onChange={(e) => setSizePrices({ ...sizePrices, [size]: e.target.value })}
                      className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                      placeholder="Precio en Lempiras"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cantidad {size}</label>
                    <input
                      type="number"
                      value={sizeQuantities[size as keyof typeof sizeQuantities]}
                      onChange={(e) => setSizeQuantities({ ...sizeQuantities, [size]: e.target.value })}
                      className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                      placeholder="Cantidad disponible"
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              
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
                onChange={(e) => setkeywordInput(e.target.value)}
                onKeyDown={handleKeywordAdd}
                className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                placeholder="Escribe y presiona Enter o Espacio para agregar"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords &&
                  keywords.map((keyword, index) => (
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
              type="button"
              disabled={!mainImage}
              className={`px-4 py-2 rounded-lg ${
                mainImage
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              onClick={handleCreateProduct}
               // Deshabilita el botón si no hay imagen
            >
              Crear
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
  );
};

export default ProductForm;