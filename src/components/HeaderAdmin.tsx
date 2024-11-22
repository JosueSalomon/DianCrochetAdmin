'use client'
import { TiLockClosed } from "react-icons/ti";
import { useRouter } from "next/navigation";

export default function HeaderBar() {
    const router = useRouter();

    const handleLogout = () => {
        // Eliminar todos los datos del localStorage
        localStorage.clear();

        // Redirigir al login
        router.push("/auth/login");
    };

    return (
        <div className='w-screen h-auto fixed top-0 left-0 bg-white p-5 shadow-lg border-gray-300 border-solid border font-rubik'>
            <div className='flex flex-col flex-nowrap justify-center items-end content-stretch'>
                <button
                    type="button"
                    title="close session"
                    onClick={handleLogout} // Evento al hacer clic
                    className='font-medium text-sm flex flex-row flex-nowrap justify-start items-center content-stretch p-1 text-gray-950 border-solid border-2 rounded-md border-gray-900 hover:bg-gray-100 transition'>
                    <TiLockClosed className='mr-2 text-lg' /> CERRAR SESION
                </button>
            </div>
        </div>
    );
}
