import React, { useState, useRef,useEffect } from "react";
import UploadModal from "../../createProduct/components/subirFotos";
import { fetchCategoriesMaterials } from "@services/materials";
import Image from 'next/image';
import { categoriasMateriales } from "@interfaces/materials";
import { MaterialWithTalla, MaterialWithoutTalla } from "@interfaces/materials";
import { createMaterialWithTalla, createMaterialWithoutTalla } from "@services/materials";

const MaterialForm: React.FC = () => {
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
  const [marca, setMarca] = useState("");
  const [keywordInput, setkeywordInput] = useState("");
  const [keywords, setkeywords] = useState<string[] | null>([]);  

  const sizeMapping: { [key: string]: keyof typeof sizePrices } = {
    LACE: "Lace",
    SUPERFINE: "Super fine",
    FINE: "Fine",
    LIGHT: "Light",
    MEDIUM: "Medium",
    BULKY: "Bulky",
    SUPERBULKY: "Super bulky",
    JUMBO: "Jumbo",
  };
  
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


  // Size-specific states for "Producto con talla"
  const [sizePrices, setSizePrices] = useState({
    Lace: "",
    "Super fine": "",
    Fine: "",
    Light: "",
    Medium: "",
    Bulky:"",
    "Super bulky":"",
    Jumbo:""
  });
  const [sizeQuantities, setSizeQuantities] = useState({
    Lace: "",
    "Super fine": "",
    Fine: "",
    Light: "",
    Medium: "",
    Bulky:"",
    "Super bulky":"",
    Jumbo:""
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
  
    if (!isCreatingProduct) return;
    const formattedKeywords = keywords && keywords.length > 0 ? keywords : null;
  
    const newMaterial: MaterialWithTalla | MaterialWithoutTalla = productType === "Producto con talla"
      ? {
          productName,
          description,
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
          mainImage,
          galleryImages: galleryImages.length > 0 ? galleryImages : null,
          keywords: formattedKeywords,
          categoryId: 4,
          marca,
        }
      : {
          productName,
          description,
          price: price === "0" || price.trim() === "" ? null : parseFloat(price),
          stock: stock === "0" || stock.trim() === "" ? null : parseInt(stock, 10),
          mainImage,
          galleryImages: galleryImages.length > 0 ? galleryImages : null,
          keywords: formattedKeywords,
          categoryId: selectedCategoryId,
          marca,
        };

        console.log("Objeto enviado:", newMaterial);

    try {
      if (productType === "Producto con talla") {
        const response = await createMaterialWithTalla(newMaterial as MaterialWithTalla);
        console.log("Material con talla creado exitosamente:", response);
      } else {
        const response = await createMaterialWithoutTalla(newMaterial as MaterialWithoutTalla);
        console.log("Material sin talla creado exitosamente:", response);
      }
  
      resetForm();
    } catch (error) {
      console.error("Error al crear el material:", error);
    } finally {
      setIsCreatingProduct(false);
      resetForm();
    }
  };

  const handleCreateProduct = () => {
    console.log("Create button clicked, setting isCreatingProduct to true");
    setIsCreatingProduct(true);
    formRef.current?.requestSubmit(); // Programmatically trigger form submission
  };

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setMarca("");
    setPrice("");
    setStock("");
    setMainImage(null);
    setGalleryImages([]);
    setkeywords([]);
    setSizePrices({ Lace: "", "Super fine": "", Fine: "", Light: "", Medium: "" ,Bulky:"", "Super bulky": "",Jumbo:""});
    setSizeQuantities({ Lace: "", "Super fine": "", Fine: "", Light: "", Medium: "" ,Bulky:"", "Super bulky": "",Jumbo:""});
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
              <option className="text-black" value="Producto sin talla">Material sin Grosor</option>
              <option value="Producto con talla">Material con grosor</option>
            </select>
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
            <div>
                    {/* Categorías (Carrusel) */}
                    <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Categorías
                          </label>
                          <select
                              id="category"
                              value={selectedCategoryId || ""}
                              onChange={(e) => handleCategorySelect(Number(e.target.value))}
                              className="p-2 border w text-black rounded-lg w-full"
                          >
                              <option value="" disabled>
                                  Selecciona una categoría
                              </option>
                              {categories.map((category) => (
                                  <option key={category.ID_CATEGORIA} value={category.ID_CATEGORIA}>
                                      {category.CATEGORIA}
                                  </option>
                              ))}
                          </select>
                        </div>
            <div className="grid grid-cols-2 gap-4 mt-[24px]">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 ">Precio</label>
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
              </div>
              ) : (
                <div className="mt-4 space-y-4">
                {["LACE", "SUPERFINE", "FINE", "LIGHT", "MEDIUM", "BULKY", "SUPERBULKY", "JUMBO"].map((size) => (
                  <div key={size} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Precio {size}</label>
                      <input
                        type="number"
                        value={sizePrices[sizeMapping[size]]}
                        onChange={(e) =>
                          setSizePrices({ ...sizePrices, [sizeMapping[size]]: e.target.value })
                        }
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
                        value={sizeQuantities[sizeMapping[size]]}
                        onChange={(e) =>
                          setSizeQuantities({ ...sizeQuantities, [sizeMapping[size]]: e.target.value })
                        }
                        className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                        placeholder="Cantidad disponible"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
                        )}
          {/*Marca */}
          <div>
               <label className="block text-sm font-medium text-gray-700">Marca</label>
                  <textarea
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    required
                    className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                    placeholder="Escribe la marca"
                    />
          </div>              

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
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
              window.location.href = "https://diancrochet-administrador.vercel.app/productos";
            }}
          >
            Volver
          </button>
          <button
              type="button" // Change to "button" to avoid implicit form submission
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              onClick={handleCreateProduct} // Explicitly triggers product creation
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

export default MaterialForm;