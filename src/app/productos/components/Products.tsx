'use client'

import { useEffect, useRef, useState } from 'react';
import { getProductosPorTipo, getProducts } from '@services/product';
import { InfoProductos } from '@interfaces/product';
import DetalleProducto from './infoProducto/DetalleProducto';

export default function Products ({indexType} : Readonly<{indexType : number}>) {
    const [productos, setProductos] = useState<InfoProductos[]>([]);
    const [productsSplit, setProductsSplit] = useState(0);

    const [pageNumber, setPageNumber] = useState(1);
    //const [isLoading, setIsLoading] = useState(true);

    const totalProducts = productos.length;

    // Calculamos x como el número de páginas (o grupos) en base a 16 productos por grupo
    const pagesNumber = Math.ceil(totalProducts / 15);
    const divNumbers = Array.from({ length: pagesNumber }, (_, i) => i + 1);
    const scrollRef = useRef<HTMLDivElement>(null);


    const handlePageNumber = (index: number) => {
        setPageNumber(index);
        setProductsSplit((index - 1) * 16);
        if (productsSplit != (index - 1) * 16) {
                window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    const handleSplitNext = () => {
        if (productos.length >= productsSplit + 16) {
            setProductsSplit(productsSplit + 16);
            setPageNumber(pageNumber + 1);
        }
    };
    
    const handleSplitPrev = () => {
        if (productsSplit - 16 >= 0) {
            setProductsSplit(productsSplit - 16);
            setPageNumber(pageNumber - 1);
        }
    };

    useEffect(() => {
        async function fetchProducts() {
          setProductsSplit(0); // Reinicia la división de productos al cambiar el tipo
          setPageNumber(1); // Reinicia la paginación al cambiar el tipo
            try {
                if (indexType === 0) {
                    const res = await getProducts();
                    setProductos(res);
                } else {
                    const res = await getProductosPorTipo(indexType);
                    setProductos(res);
                }
            } catch (error) {
                console.error('Error al traer productos:', error);
            }
        }
        fetchProducts();
    }, [indexType]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pageNumber, productsSplit]);

    return (
        <div ref={scrollRef} className="w-full h-full  overflow-y-auto">
            <div className="w-full h-90% flex flex-wrap">
            {productos
                .slice(productsSplit, productsSplit + 16)
                .map((producto) => (
                <div
                    key={producto.id_producto}
                    className="w-[30%] ml-4 mb-4"
                >
                    <DetalleProducto
                    id={producto.id_producto}
                    nombre={producto.nombre_prod}
                    precio={`L${producto.precio_venta.toFixed(2)}`}
                    color={producto.color}
                    cantidad_vendida={producto.cantidad_vendida}
                    cantidad_disp={producto.cantidad_disp}
                    imagen={
                        producto.url_imagen != null
                        ? producto.url_imagen
                        : "https://ik.imagekit.io/diancrochet/Fotos/GORROCUERNOS.jpg?updatedAt=1728867304044"
                    }
                    />
                </div>
            ))}
            </div>

            <div className=' h-[10%] w-full'>
                
            <div className="flex h-20 items-start justify-end px-[5.32%]">
                <div className="flex h-2/3 cursor:pointer">
                    <button
                    onClick={handleSplitPrev}
                    type="button"
                    className=" mb-2 me-2 flex h-full w-20 items-center justify-center bg-slate-300 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200 ease-in hover:bg-pink-500 focus:outline-none focus:ring-4 focus:ring-transparent"
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                    </svg>
                    </button>
                <div className="flex cursor-pointer h-full items-center justify-evenly bg-slate-50 px-1">
                    {divNumbers.map((number) =>
                        divNumbers.length > 4 ? (
                        pageNumber > 2 ? (
                            number == divNumbers.length - 1 &&
                            number != pageNumber + 1 &&
                            number != pageNumber ? (
                            <div key={number} className="mx-1 flex h-7 cursor-pointer w-9 items-end justify-center font-lekton text-lg text-blue-400">
                                ...
                            </div>
                            ) : number == divNumbers.length && number != pageNumber ? (
                            <div
                                key={number}
                                onClick={() => handlePageNumber(number)}
                                className={`mx-1 flex h-7 w-7 cursor-pointer items-center justify-center border pt-1 font-lekton text-lg ${
                                pageNumber === number
                                    ? "bg-pink-500 text-white cursor-pointer" // Estilos cuando pageNumber coincide con number
                                    : "bg-slate-300 text-white cursor-pointer hover:bg-pink-500 hover:text-white" // Estilos por defecto
                                }`}
                            >
                                {number}
                            </div>
                            ) : number >= pageNumber - 1 && number <= pageNumber + 1 ? (
                            <div
                                key={number}
                                onClick={() => handlePageNumber(number)}
                                className={`mx-1 flex h-7 w-7 cursor-pointer items-center justify-center border pt-1 font-lekton text-lg ${
                                pageNumber === number
                                    ? "bg-pink-500 text-white cursor-pointer" // Estilos cuando pageNumber coincide con number
                                    : "bg-slate-300 text-white cursor-pointer hover:bg-pink-500 hover:text-white" // Estilos por defecto
                                }`}
                            >
                                {number}
                            </div>
                            ) : (
                            ""
                            )
                        ) : number == divNumbers.length - 1 ? (
                            <div key={number} className="mx-1 flex h-7 w-9 items-end justify-center font-lekton text-lg text-blue-400">
                            ...
                            </div>
                        ) : number == divNumbers.length ? (
                            <div
                            key={number}
                            onClick={() => handlePageNumber(number)}
                            className={`mx-1 flex h-7 w-7 items-center cursor-pointer justify-center border pt-1 font-lekton text-lg ${
                                pageNumber === number
                                ? "bg-pink-500 text-white cursor-pointer" // Estilos cuando pageNumber coincide con number
                                : "bg-slate-300 text-white cursor-pointer hover:bg-pink-500 hover:text-white" // Estilos por defecto
                            }`}
                            >
                            {number}
                            </div>
                        ) : number <= 3 ? (
                            <div
                            key={number}
                            onClick={() => handlePageNumber(number)}
                            className={`mx-1 flex h-7 w-7 cursor-pointer items-center justify-center border pt-1 font-lekton text-lg ${
                                pageNumber === number
                                ? "bg-pink-500 text-white cursor-pointer" // Estilos cuando pageNumber coincide con number
                                : "bg-slate-300 text-white hover:bg-pink-500 hover:text-white cursor-pointer" // Estilos por defecto
                            }`}
                            >
                            {number}
                            </div>
                        ) : (
                            ""
                        )
                        ) : (
                        <div
                            key={number}
                            onClick={() => handlePageNumber(number)}
                            className={`mx-1 flex h-7 cursor-pointer w-7 items-center justify-center border pt-1 font-lekton text-lg ${
                            pageNumber === number
                                ? "bg-pink-500 text-white hover:cursor-pointer" // Estilos cuando pageNumber coincide con number
                                : "bg-slate-300 text-white hover:bg-pink-500 hover:text-white hover:cursor-pointer" // Estilos por defecto
                            }`}
                        >
                            {number}
                        </div>
                        ),
                    )}
                    </div>
                    <button
                    onClick={handleSplitNext}
                    type="button"
                    className="cursor-pointer mb-2 me-2 flex h-full w-20 items-center justify-center bg-slate-300 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200 ease-in hover:bg-pink-500 hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-transparent dark:focus:ring-transparent"
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        className="size-6 -scale-x-90"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                    </svg>
                    </button>
                </div>
            </div>


        </div>
    </div>
    )
}