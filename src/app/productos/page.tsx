'use client'


import HeaderAdmin from 'components/HeaderAdmin'
import SideBar from 'components/sidebar'
import Titulo from './components/Titulo'
import Interactions from './components/Interactions'

export default function productos () {
    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden ">
            <div className="h-[12%] w-full">
                <HeaderAdmin/>
            </div>
            
                <SideBar/>

            <div className='flex h-full w-full pt-[5%] pl-[18%]'>
                <div className="h-full z-2 w-full bg-[#COCOCO]">
                    <div className="h-[8%] w-full">
                        <Titulo/></div>
                    <div className="h-full w-full">
                        <Interactions/></div>
                    </div>
            </div>
        </div>
    )
}