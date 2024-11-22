"use client";
import Sidebar from "../../components/sidebar";
import Headerbar from "../../components/header";

export default function ShopCart() {
    return (
      <main className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
        <section className="imagen relative flex h-[92%] w-full items-center justify-center mt-16">
          <Headerbar/>
          <Sidebar />
        </section>
      </main>
    );
  }
  