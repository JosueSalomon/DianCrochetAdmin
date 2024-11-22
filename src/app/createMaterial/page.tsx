'use client';

import Footer from "components/Footer";
import HeaderAdmin from 'components/HeaderAdmin'
import MaterialForm from "./components/MaterialesForm";
import SideBar from 'components/sidebar'


export default function Dashboard() {
    return (
      <div className="w-full min-h-screen flex flex-col bg-slate-50"> 
      <div className="h-[12%] w-full">
                <HeaderAdmin/>
            </div>
            <SideBar/>
        <main className="bg-slate-50 flex-grow justify-center items-center mt-[4.3%] h-full">
          <div className='flex justify-center items-center'>
            <MaterialForm/>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  