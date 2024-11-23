'use client'

import HeaderAdmin from 'components/HeaderAdmin'
import SideBar from 'components/Sidebar'
import Titulo from './components/Titulo'
import Interactions from './components/Interactions'

export default function Productos() {
    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
            {/* Header */}
            <div className="h-[12%] w-full bg-slate-50">
                <HeaderAdmin />
            </div>

            {/* Sidebar and Main Content */}
            <div className="flex h-full w-full bg-slate-50">
                {/* Sidebar */}
                <div className="w-[18%] ">
                    <SideBar />
                </div>

                {/* Main Content */}
                <div className="flex flex-col h-full w-full bg-slate-100 p-5">
                    {/* Title */}
                    <div className="h-[8%] w-full mb-9 bg-slate-50">
                        <Titulo />
                    </div>

                    {/* Interactions */}
                    <div className="h-full w-full bg-slate-50">
                        <Interactions />
                    </div>
                </div>
            </div>
        </div>
    )
}
