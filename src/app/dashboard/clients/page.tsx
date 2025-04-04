"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { ScalarClient } from "@/types/client";
import { useRouter } from "next/navigation";

function UserPage() {
    const [users, setUsers] = useState<ScalarClient[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    console.log(users)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`/api/dash/clients?page=${currentPage}&pageSize=${usersPerPage}`);

                if (response.data.success) {
                    setUsers(response.data.data.users);
                    setTotalPages(Math.ceil(response.data.data.totalCount / usersPerPage));
                } else {
                    setError("Error al cargar los usuarios.");
                }
            } catch (err) {
                setError("Error al conectar con el servidor.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage]);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <SidebarLayout>
            <div className="h-full p-6 bg-white rounded-lg shadow-md flex flex-col overflow-scroll">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-start">Gestión de Usuarios</h2>

                {loading ? (
                    <p className="text-gray-600 text-center">Cargando usuarios...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <>
                        <div className="w-full space-y-4">
                            {users.map((user, index) => (
                                <div key={index} className="flex flex-col sm:flex-row w-full">
                                    <div className="flex items-center px-4 rounded-lg w-full">
                                        <Image
                                            src={user.avatar && user.avatar.startsWith("http") ? user.avatar : "/avatar-placeholder.png"}
                                            alt="Avatar"
                                            width={50}
                                            height={50}
                                            className="mr-4 rounded-lg" // Usa rounded-lg en vez de rounded-full para bordes suaves
                                        />

                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">{user.names}</h3>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap sm:flex-nowrap p-4 gap-3 w-full sm:w-auto">
                                        <button onClick={() => router.push(`/dashboard/clients/${user.id}`)} className="min-w-[140px] w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg text-xs shadow hover:bg-blue-600 transition">
                                            Visitar Perfil
                                        </button>
                                        <button className="min-w-[140px] w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg text-xs shadow hover:bg-green-600 transition">
                                            Enviar Correo
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-6 w-full max-w-2xl">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 text-white rounded-lg text-xs shadow transition ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800"
                                    }`}
                            >
                                Anterior
                            </button>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 text-white rounded-lg text-xs shadow transition ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800"
                                    }`}
                            >
                                Siguiente
                            </button>
                        </div>
                    </>
                )}
            </div>
        </SidebarLayout>
    );
}

export default UserPage;