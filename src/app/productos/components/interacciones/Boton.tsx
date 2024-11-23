'use client';

import { useRouter } from 'next/navigation';

export default function Boton() {
    const router = useRouter();

    // Función para verificar si el usuario existe en localStorage
    const isUserLoggedIn = () => {
        const usuario = localStorage.getItem("usuario");
        return usuario ? true : false;
    };

    // Función para manejar la navegación a la página de crear producto
    const handleCreateProduct = () => {
        if (isUserLoggedIn()) {
            router.push('/createProduct');
        } else {
            console.log("No hay datos en localStorage. Navegación bloqueada.");
            alert("Debes iniciar sesión para realizar esta acción.");
        }
    };

    // Función para manejar la navegación a la página de crear material
    const handleCreateMaterial = () => {
        if (isUserLoggedIn()) {
            router.push('/createMaterial');
        } else {
            console.log("No hay datos en localStorage. Navegación bloqueada.");
            alert("Debes iniciar sesión para realizar esta acción.");
        }
    };

    return (
        <div className="w-full h-full flex">
            <button
                className="w-[50%] font-lekton mr-2 size-8 py-1 px-3 bg-[#C68EFE] hover:bg-[#b067f8] rounded-md shadow-lg text-white font-semibold transition duration-200 text-base"
                type="button"
                onClick={handleCreateProduct}
            >
                <p className="">+ Producto</p>
            </button>

            <button
                className="w-[50%] font-lekton size-8 py-1 px-3 bg-[#C68EFE] hover:bg-[#b067f8] rounded-md shadow-lg text-white font-semibold transition duration-200 text-base"
                type="button"
                onClick={handleCreateMaterial}
            >
                <p className="">+ Material</p>
            </button>
        </div>
    );
}
