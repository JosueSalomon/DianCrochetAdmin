import React, { useEffect } from "react";

interface SuccessAlertProps {
  message: string; // Mensaje principal
  subMessage: string; // Mensaje secundario
  onClose: () => void; // Acción al cerrar
  duration?: number; // Duración opcional en milisegundos
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  subMessage,
  onClose,
  duration = 5000, // Duración por defecto: 5 segundos
}) => {
  // Auto-cerrar después de `duration`
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex w-80 h-24 bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <svg width="16" height="96" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 8 0 
             Q 4 4.8, 8 9.6 
             T 8 19.2 
             Q 4 24, 8 28.8 
             T 8 38.4 
             Q 4 43.2, 8 48 
             T 8 57.6 
             Q 4 62.4, 8 67.2 
             T 8 76.8 
             Q 4 81.6, 8 86.4 
             T 8 96 
             L 0 96 
             L 0 0 
             Z"
          fill="#66cdaa"
          stroke="#66cdaa"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
      </svg>
      <div className="mx-2.5 overflow-hidden w-full">
        <p className="mt-1.5 text-xl font-bold text-[#66cdaa] leading-8 mr-3 overflow-hidden text-ellipsis whitespace-nowrap">
          {message}
        </p>
        <p className="overflow-hidden leading-5 break-all text-zinc-400 max-h-10">
          {subMessage}
        </p>
      </div>
      <button
        className="w-16 cursor-pointer focus:outline-none"
        onClick={onClose}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="mediumseagreen"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default SuccessAlert;
