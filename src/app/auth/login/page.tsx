'use client';

import Footer from "components/Footer";
import LoginForm from "../login/components/LoginForm";
import Logo from "../login/components/Logo"

export default function Login() {
    return (
        <main className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden ">
            <div className="h-[80%] w-full flex items-center z-2"> 
                <div className="bg-[url('/img/BackgroundLogin.svg')] bg-cover bg-center w-[35%] h-full"></div>
                
                <div className="w-[70%] h-full bg-purple-200 flex flex-col justify-center items-center ">
                        <Logo />
                    <div className= "w-[60%] h-[70%] shadow-2xl bg-[#FCFAF9] rounded-3xl p-8">
                        <LoginForm />
                    </div>
                </div>
            </div>

            <div className=" w-full"><Footer /></div>
        </main>
    );
}

