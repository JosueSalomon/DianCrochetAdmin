'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Hook para navegación en componentes cliente
import Footer from 'components/Footer';
import Navbar from 'components/navbar';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login'); 
  }, [router]);
  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">  
      <Navbar />  
      <main className="bg-slate-50 flex-grow w-full mt-10">
        <div className='flex justify-center items-center'>
          <h1 className='size-96 text-black'>Bienvenido al Dashboard</h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}
