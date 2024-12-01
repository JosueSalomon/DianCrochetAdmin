'use client'

'use client';

import Footer from "components/Footer";
import HeaderAdmin from 'components/HeaderAdmin'
import KitsForm from "./components/KitsForm";




export default function Dashboard() {
    return (
      <div className="w-full min-h-screen flex flex-col bg-slate-50"> 
      <div className="h-[12%] w-full">
                <HeaderAdmin/>
            </div>
            
        <main className="bg-slate-50 flex-grow justify-center items-center mt-[4.3%] h-full">
          <div className='flex justify-center items-center'>
            <KitsForm/>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  