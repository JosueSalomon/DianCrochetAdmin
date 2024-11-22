'use client'

import { useEffect, useRef, useState } from 'react'
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons/faEllipsisH"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from 'next/navigation';
import Modal from '../modal/modal'

export default function BotonDespl ({indexProduct} : {indexProduct : number}) {
    const [isOpen, setIsOpen] = useState(false);
    const botonRef = useRef<HTMLDivElement>(null);
    const [, setEdit] = useState(0);
    const [, setDeleteProduct] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleDeleteProduct = (index: number) => {
        const usuario = localStorage.getItem("usuario");
    
        if (usuario) {
            setDeleteProduct(index);
            setShowModal(true);
        } else {
            console.log("No hay datos en localStorage. Acción bloqueada.");
            alert("Debes iniciar sesión para eliminar un producto.");
        }
    };
    

    const handleEditProduct = (index: number) => {
        const usuario = localStorage.getItem("usuario");
    
        if (usuario) {
            setEdit(index);
            router.push(`https://dian-crochet-admin-five.vercel.app/update/${index}`);
        } else {
            console.log("No hay datos en localStorage. Navegación bloqueada.");
            alert("Debes iniciar sesión para editar un producto.");
        }
    };
    

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (botonRef.current && !botonRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
    <div ref={botonRef} className="relative">
        {!isOpen && (
            <div onClick={() => setIsOpen(true) } className="h-full w-full flex justify-center items-center rounded-md z-2  cursor-pointer">
                <div>
                    <FontAwesomeIcon icon= {faEllipsisH} className="text-xl  text-[#b266ff] text-center hover:text-purple-600" />
                </div>
            </div>
        )}

        {isOpen && (
            <div className="w-40 absolute bg-white rounded-md shadow-lg z-10 font-lekton text-base">
                <a onClick={() => {handleEditProduct(indexProduct)}} href="#" className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 ">
                    Editar
                </a>
                <a onClick={() => {handleDeleteProduct(indexProduct)}} href="#" className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200">
                    Eliminar
                </a>
            </div>
        )}

        {showModal ? (
            <Modal
            title={'Eliminar producto'}
            message={'Estas seguro que quieres eliminar este producto'}
            type={2}
            open={showModal}
            setOpen={setShowModal}
            index= {indexProduct}
            />
        ) : (
            ""
        )}
    </div>
    )
}