//Ola como ta
'use client';

import Footer from 'components/Footer';
import Navbar from 'components/navbar';


export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">  
      <Navbar/>  
      <main className="bg-slate-50 flex-grow w-full mt-10">
        <div className='flex justify-center items-center'>
          <h1 className='size-96 text-black'></h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}
