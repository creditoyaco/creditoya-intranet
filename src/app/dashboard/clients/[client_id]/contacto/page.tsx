"use client"

import { useState, useRef } from 'react';
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useClient from "@/hooks/dashboard/useClients";
import { use } from "react";
import { IoSend, IoAttach } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdAlternateEmail } from 'react-icons/md';
import { FaRegCircleUser } from 'react-icons/fa6';

interface ContactProps { params: Promise<{ client_id: string }> }
interface AttachmentFile { name: string; size: number; id: string; }

function ContactClientPage({ params }: ContactProps) {
    const resolveParams = use(params);
    const clientId = resolveParams.client_id;
    const { clientData } = useClient({ params });

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles: AttachmentFile[] = Array.from(e.target.files).map(file => ({
                name: file.name,
                size: file.size,
                id: Math.random().toString(36).substr(2, 9)
            }));
            setAttachments([...attachments, ...newFiles]);
        }
    };

    const removeAttachment = (id: string) => {
        setAttachments(attachments.filter(file => file.id !== id));
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ subject, message, attachments });
        alert("Funcionalidad en mantenimiento ...")
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 min-h-screen overflow-scroll">
                <div className="w-full">
                    <div className="px-6 py-4">
                        <header className="mb-8">
                            <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Nuevo mensaje</h1>
                            <p className="text-gray-500 text-sm mt-1">Investiga datos personales, historial de prestamos, edita su informacion y toma control sobre sus cuentas</p>
                        </header>
                        {clientData && (
                            <div className='mt-1 flex flex-wrap gap-3'>
                                <div className='grid place-content-center bg-gray-50 px-3 py-2 rounded-md border border-gray-100'>
                                    <div className='flex flex-row gap-0.5'>
                                        <div className='grid place-content-center'>
                                            <MdAlternateEmail className='drop-shadow-md text-gray-500' />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-500 pb-0.5">
                                            Correo Electronico:
                                            <span className='font-thin text-sm text-gray-500 pb-0.5'> {clientData.email}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className='grid place-content-center bg-gray-50 px-3 py-2 rounded-md border border-gray-100'>
                                    <div className='flex flex-row gap-1'>
                                        <div className='grid place-content-center'>
                                            <FaRegCircleUser className='drop-shadow-md text-gray-500' />
                                        </div>
                                        <p className="text-sm font-normal text-gray-500 pb-0.5">
                                            Nombre:
                                            <span className='font-thin text-xs text-gray-500 pb-0.5'> {`${clientData.names} ${clientData.firstLastName} ${clientData.secondLastName}`}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-6">
                            {/* Campo de asunto */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition text-base"
                                    placeholder="Escribe el asunto del correo"
                                    required
                                />
                            </div>

                            {/* Campo de mensaje */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mensaje
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-md h-72 resize-none focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition text-base"
                                    placeholder="Escribe tu mensaje aquí..."
                                    required
                                />
                            </div>

                            {/* Lista de archivos adjuntos */}
                            {attachments.length > 0 && (
                                <div className="border border-gray-100 rounded-md bg-gray-50 p-4">
                                    <h3 className="text-xs font-medium text-gray-700 mb-2">Archivos adjuntos</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {attachments.map(file => (
                                            <li key={file.id} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200">
                                                <div className="truncate flex-1">
                                                    <span className="text-sm font-medium">{file.name}</span>
                                                    <span className="text-xs text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(file.id)}
                                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                                >
                                                    <IoMdClose size={18} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div>
                                    <input
                                        type="file"
                                        multiple
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        className="flex items-center text-sm font-medium text-gray-600 hover:text-green-600 transition px-4 py-2 border border-gray-200 rounded-md"
                                    >
                                        <IoAttach size={20} className="mr-2" />
                                        Adjuntar archivos
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md font-medium flex items-center transition"
                                >
                                    <IoSend size={20} className="mr-2" />
                                    Enviar mensaje
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}

export default ContactClientPage;