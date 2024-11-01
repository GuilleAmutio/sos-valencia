"use client";

import {useState} from "react";

interface ImageModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

export default function EmergencyInformation() {
    const [isEmergencyExpanded, setIsEmergencyExpanded] = useState(false);
    return (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl shadow-md mb-8 mt-4">
            <h2 className="text-2xl font-bold text-red-700 p-4">⚠️ Información de Emergencia</h2>

            <button
                onClick={() => setIsEmergencyExpanded(!isEmergencyExpanded)}
                className="w-full px-4 pb-2 flex justify-end items-center text-left hover:bg-red-100/50 transition-colors"
                aria-expanded={isEmergencyExpanded}
            >
            <span className="text-red-700 text-sm mr-2">
              {isEmergencyExpanded ? 'Ocultar información' : 'Mostrar información'}
            </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 text-red-700 transition-transform duration-200 ${
                        isEmergencyExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            <div
                className={`transition-all duration-200 ease-in-out ${
                    isEmergencyExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
            >
                <div className="px-6 pb-6">
                    <div className="space-y-3">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-red-800">Números de Emergencia:</h3>
                            <ul className="list-disc list-inside ml-4 text-red-700">
                                <li>Emergencias: 112</li>
                                <li>Personas desaparecidas: 900 365 112</li>
                            </ul>
                            <h3 className="text-lg font-semibold text-red-800">Información adicional:</h3>
                            <ul className="list-disc list-inside ml-4 text-red-700">
                                <li>
                                    <a
                                        href="https://www.mediavida.com/foro/off-topic/temporal-en-el-sudeste-espanol-716124"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-red-700 hover:text-red-900 underline hover:no-underline transition-all"
                                    >
                                        Primer mensaje del hilo en el foro Mediavida (voluntariado, donaciones, centros
                                        de acogida)
                                    </a>
                                </li>
                            </ul>
                        </div>


                        <div className="bg-red-100 p-4 rounded-lg mt-4">
                            <h3 className="text-lg font-semibold text-red-800">Recomendaciones:</h3>
                            <ul className="list-disc list-inside ml-4 text-red-700">
                                <li>Evite coger el coche y salir de casa</li>
                                <li>Tenga preparado un kit de emergencia</li>
                                <li>Siga las instrucciones de las autoridades</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
