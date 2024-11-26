'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faLock } from "@fortawesome/free-solid-svg-icons";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { loginData } from "@interfaces/user";
import { login } from "@services/UserAuth/user"
import { useRouter } from "next/navigation";

export default function LoginForm () {
    const router = useRouter();

    const [formData, setFormData] = useState<loginData>({
        correo: "",
        contrasena: "",
    });

    const [, setLoading] = useState(false);
    const [codigo, setCodigo] = useState(0);
    const [, setMessage] = useState("");
    const [correoError, setCorreoError] = useState("");
    const [contrasenaError, setContrasenaError] = useState("");


    // Maneja los cambios en los inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    //Envío del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setCorreoError("");
        setContrasenaError("");
        try {
        // Realiza una petición POST con los datos del formulario
        const response = await login(formData);
        setMessage(response.mensaje);

        if (response.admin.codigo == 1) {
            localStorage.setItem('usuario', JSON.stringify(response));
            setCodigo(1);
            router.push("https://diancrochet-administrador.vercel.app/ordenes/all-ordens");
        } else if (response.admin.codigo == 2) {
            setCodigo(2);
            setCorreoError("Usuario no administrativo");
        } else if (response.admin.codigo == 3) {
            setCodigo(3);
            setContrasenaError(response.admin.mensaje);
        } else if (response.admin.codigo == 4) {
            setCodigo(4);
        }
        } catch (error) {
            console.error("Error en la petición:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return(
        <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
            <div className="flex flex-col h-full w-full">

                <div className="h-[30%] flex flex-col justify-items-start"> 
                    <p className="font-bold text-black text-2xl font-crimson">Login</p>
                    <p className="text-gray-700 font-light text-base font-crimson">Bienvenido administrador</p>
                </div>
                
                <div className="h-[50%] flex flex-col justify-between">
                    <div className={`shadow-lg ${codigo == 2 ? "border-red-600 placeholder:text-red-500 border-2" : "border-gray-200 placeholder:text-gray-400"} flex gap-2 items-center bg-white p-2 hover:shadow-xl hover:border-2 border-gray-300 group delay-200 rounded-xl`}>
                        <div>
                            <FontAwesomeIcon icon={faUserTie} className={`${codigo == 2 ? "text-red-600" : "text-gray-400" } text-2xl`}/>
                        </div>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            className={`flex-1 focus:outline-none border-none focus:ring-0 text-black `}
                            placeholder={codigo == 2 ? "correo incorrecto" : "correo"}
                            onChange={handleChange}
                        />
                    </div>
                        
                        
                    <div className={`shadow-lg  ${codigo == 3 ? "border-red-600 placeholder:text-red-500 border-2" : "border-gray-200 placeholder:text-gray-400 border-2"}  flex gap-2 items-center bg-white p-2 hover:shadow-xl hover:border-2 group delay-200 rounded-xl`}>
                        <div>
                            <FontAwesomeIcon icon={ faLock } className={`${codigo == 3 ? "text-red-600" : "text-gray-400" } text-2xl`}/>
                        </div>
                        <input
                            type="password"
                            name="contrasena"
                            value={formData.contrasena}
                            className={`flex-1 focus:outline-none focus:border-none border-none text-black focus:ring-0`}
                            placeholder={codigo == 3 ? "contraseña incorrecta" : "contraseña"}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            

                <div className="h-[20%]  flex flex-col-reverse items-center">
                        <button className="w-[40%] py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200"
                        type="submit">
                        Iniciar sesión
                        </button>
                    <div className="absolute top-[27%] right-[17%]">
                        {correoError && (
                            <p className="text-red-500 text-sm ">{correoError}</p>
                        )}

                        {contrasenaError && (
                            <p className="text-red-500 text-sm">{contrasenaError}</p>
                        )}
                    </div>
                </div>
                
            </div>
        </form>
    );
}
