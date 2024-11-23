'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef } from 'react';
import SearchBar from './interacciones/SearchBar'
import Boton from './interacciones/Boton'
import Products from './Products';

export default function Interactions () {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [idTypeProduct, setIdTypeProduct] = useState(0);



    const handleIdTypeProduct = (index: number) => {
        setIdTypeProduct(index);
        setIsOpen(false);
        console.log(idTypeProduct);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full h-full">
            <div className="flex justify-between items-center w-full h-[10%]">
                <div className=" w-[25%] h-full px-3 flex-col ">
                    
                    <div ref={menuRef} className="relative">
                        
                        <div onClick={() => setIsOpen(!isOpen)} className="hover:text-gray-800 relative z-2 cursor-pointer z-2 font-lekton font-semibold text-gray-700 flex justify-center items-center mt-1">
                            <div>
                                Tipos
                            </div>
                            <div>
                                <FontAwesomeIcon icon={ faChevronDown } className='text-sm'/>
                            </div>
                        </div>

                        {isOpen && (
                            <div className="w-48 absolute bg-white rounded-md shadow-lg z-40 font-lekton text-base z-5">
                            <a onClick={() => handleIdTypeProduct(1)} href="#" className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 ">
                                Productos
                            </a>
                            <a onClick={() => handleIdTypeProduct(3)} href="#" className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200">
                                Materiales
                            </a>
                            <a onClick={() => handleIdTypeProduct(2)} href="#" className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200">
                                Kits
                            </a>
                            <a onClick={() => handleIdTypeProduct(4)} href="#" className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200">
                                Tutoriales
                            </a>
                            </div>
                        )}
                    
                    </div>
                </div>

                <div className="w-[50%] h-full px-3">
                    <SearchBar/>
                </div>

                <div className="w-[25%] h-full px-3">
                    <Boton/>
                </div>
            </div>

            <div className="w-full h-[85%] px-3">
                    <Products
                        indexType={idTypeProduct}
                    />
            </div>
        </div>
    )
}