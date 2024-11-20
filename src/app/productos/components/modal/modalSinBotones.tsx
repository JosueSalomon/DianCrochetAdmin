'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface ModalProps {
title: string;
type: number;
message: string;
open: boolean; // Añadir `open` como prop
setOpen: (value: boolean) => void; // Añadir `setOpen` como prop
}

export default function Modal({ title, type, message, open, setOpen }: ModalProps) {
const getIcon = (type: number) => {
    switch (type) {
    case 1: // Éxito
        return <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-500" />;
    case 2: // Advertencia
        return <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-yellow-500" />;
    case 3: // Error
        return <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-500" />;
    default: // Default (puedes personalizarlo)
        return <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-gray-500" />;
    }
};

const backgroundColorClass = type === 1
? 'bg-green-50'
: type === 2
? 'bg-yellow-50'
: type === 3
? 'bg-red-100'
: 'bg-gray-50';

return (
    <Dialog open={open} onClose={setOpen} className="relative z-30 border border-red-600">
    <DialogBackdrop
        transition
        className="fixed  inset-0 bg-gray-500 bg-opacity-50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
    />

    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
        >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${backgroundColorClass}`}>
                {getIcon(type)}
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {title}
                </DialogTitle>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        {message}
                    </p>
                </div>
                </div>
            </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-white px-3 font-lekton py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
                Cerrar
            </button>

            </div>
        </DialogPanel>
        </div>
    </div>
    </Dialog>
)
}