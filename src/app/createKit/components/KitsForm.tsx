import React, { useState, useRef,useEffect } from "react";
import { fetchCategories } from "@services/product";
import UploadModal from "./subirFotos_kit";
import Image from 'next/image';
import { createKit } from "@services/kits";
import { Kit, Category } from "@interfaces/kits"; 
import Modal from "./modal";
import SubirPdf from "./subirPdf";
import SuccessAlert from "./SuccessAlert";



const KitsForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productType, setProductType] = useState("Kit");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"main" | "gallery" | "pdf">();
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfKit, setPdfKit] = useState<string | null>(null);
  const [nombre_prod, setNombre_prod] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad_total, setCantidad_total] = useState("");
  const [keywordInput, setkeywordInput] = useState("");
  const [keywords, setkeywords] = useState<string[] | null>([]); 
  
  // Estados para manejar las categorías y el menú
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const formattedKeywords = keywords && keywords.length > 0 ? keywords : null;
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


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
	
     // Función para abrir el modal del PDF
      const handleOpenPdfModal = () => setIsPdfModalOpen(true);
      // Función para cerrar el modal del PDF
      const handleClosePdfModal = () => setIsPdfModalOpen(false);

      // Función para manejar la URL del PDF cargado
      const handlePdfUpload = (url: string) => {
        setPdfKit(url);
        handleClosePdfModal();
      };


  const handleRemoveGalleryImage = (url: string) => {
    setGalleryImages((prevImages) => prevImages.filter((img) => img !== url));
  };
  const handleProductTypeChange = (type: string) => setProductType(type);

  const handleOpenModal = (type: "main" | "gallery" | "pdf") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleUpload = (urls: string[]) => {
    if (modalType === "gallery") {
      setGalleryImages(urls);
    } else if (modalType === "main") {
      setMainImage(urls[0] || null);
    } else if (modalType === "pdf") {
      setPdfKit(urls[0] || null);
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
      if (productType === "Kit") {
        const newProduct: Kit = {
          nombre_prod,
          precio:parseFloat(precio),
          cantidad_total: parseInt(cantidad_total, 10),
          categorias: selectedCategoryIds,
          url_imagen_principal: mainImage || "",
          url_imagen_miniaturas: galleryImages.length > 0 ? galleryImages : null,
          url_patron: pdfKit || "",
          descripcion,
          url_tutorial:"",
          keywords: formattedKeywords,
        };
        console.log("Enviando Kit", newProduct);
        const response = await createKit(newProduct);
        console.log("Respuesta del servidor kit", response);
      }
  
      // Resetea el formulario tras la creación exitosa
      setIsCreatingProduct(false);
      resetForm();
    } catch (error) {
      console.error("Error al crear el kit", error);
    }
  };

  const handleCreateProduct = () => {
    if (!mainImage) {
      alert("Debes cargar una imagen principal antes de continuar.");
      return;
    }

    if (!pdfKit) {
      alert("Debes cargar un tutorial antes de continuar");
      return;
    }

    setIsCreatingProduct(true);

    // Simula el proceso de creación
    setTimeout(() => {
      setShowSuccessMessage(true);
      setIsCreatingProduct(false);

      // Redirige después de 3 segundos
      setTimeout(() => {
        window.location.href =
          "https://diancrochet-administrador.vercel.app/productos";
      }, 3000);
    }, 1000);
  };

  const resetForm = () => {
    setNombre_prod("");
    setDescripcion("");
    setPrecio("");
    setCantidad_total("");
    setMainImage(null);
    setGalleryImages([]);
    setkeywords([]);
    setSelectedCategoryIds([]);
    setPdfKit(null);

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
              disabled
            >
              <option className="text-black" value="Kit">Kit</option>
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
              value={nombre_prod}
              onChange={(e) => setNombre_prod(e.target.value)}
              required
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black"
              placeholder="Escribe el nombre del producto"
            />
          </div>

          {/* Price and Stock */}
          {productType === "Kit" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
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
                  value={cantidad_total}
                  onChange={(e) => setCantidad_total(e.target.value)}
                  required
                  className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                  placeholder="Cantidad disponible"
                  min="0"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              
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
              onClick={() => handleOpenModal("main")}
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
              onClick={() => handleOpenModal("gallery")}
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
          {/* PDF UPLOAD */}
          <div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tutorial del Kit/PDF</label>
            <div
              className="mt-2 border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer"
              onClick={handleOpenPdfModal} // Función para abrir el modal del PDF
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
              <SubirPdf onSubmit={handlePdfUpload} nombre_prod={nombre_prod} setNombre_prod={setNombre_prod}
              initialUploadedFileUrl={pdfKit} />
            </Modal>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="col-span-2 flex justify-end space-x-3 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={() => {
              window.location.href = "https://diancrochet-administrador.vercel.app/productos";
            }}
          >
            Volver
          </button>
            
          <div className="relative">
              <button
                type="button"
                disabled={!mainImage || isCreatingProduct}
                className={`px-4 py-2 rounded-lg ${
                  mainImage
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                onClick={handleCreateProduct}
              >
                Crear
              </button>

              {/* Mostrar el mensaje de éxito si corresponde */}
              {showSuccessMessage && (
                <SuccessAlert
                  message="¡Éxito!"
                  subMessage="Kit creado correctamente."
                  onClose={() => setShowSuccessMessage(false)}
                  duration={5000} // Mensaje visible por 8 segundos
                />
              )}
            </div>
        </div>
      </form>

      {/* Upload Modal */}
      {isModalOpen && (
            <UploadModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onImageUpload={handleUpload} // Cambiado para manejar todos los tipos (main, gallery, pdf)
                existingImages={
                modalType === "gallery"
                    ? galleryImages
                    : modalType === "main"
                    ? mainImage
                    ? [mainImage]
                    : []
                    : pdfKit
                    ? [pdfKit]
                    : []
                } // Decide qué imágenes o PDF mostrar según el modalType
                isGallery={modalType === "gallery"} // Define si es galería para lógica de múltiples archivos
            />
            )}
    </div>
  );
};
export default KitsForm;