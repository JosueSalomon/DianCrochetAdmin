'use client';

import Footer from "components/Footer";
import ProductForm from "./components/Product_notallas_Form";
import HeaderAdmin from "components/HeaderAdmin";
import Sidebar from "components/Sidebar";


export default function Dashboard() {
    return (
      <div className="w-full min-h-screen flex flex-col bg-slate-50"> 
      <div className="h-[12%] w-full">
                <HeaderAdmin/>
            </div>
            <Sidebar/>
        <main className="bg-slate-50 flex-grow justify-center items-center mt-[4.3%] h-full">
          <div className='flex justify-center items-center'>
            <ProductForm/>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  