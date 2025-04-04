"use client"

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { useState, useEffect } from "react";
import { FiSearch, FiUser, FiDollarSign, FiCalendar, FiFileText } from "react-icons/fi";
import exampleData from "@/components/jsons/examplesLoans.json" assert { type: "json" };
import axios from "axios";

interface User {
    names: string;
    firstLastName: string;
    secondLastName: string;
    currentCompanie: string;
    city: string;
}

interface Document {
    typeDocument: string;
    number: string;
}

interface LoanApplication {
    id: string;
    cantity: string;
    newCantity?: string;
    newCantityOpt?: boolean;
    status: string;
    created_at: string;
    reasonChangeCantity?: string;
    reasonReject?: string;
    entity: string;
}

interface LoanData {
    user: User;
    document: Document;
    loanApplication: LoanApplication;
}

function ActiveSection() {
    const [activeTab, setActiveTab] = useState<'aprobados' | 'aplazados' | 'cambio'>('aprobados');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [loanData, setLoanData] = useState<LoanData[]>([]);
    const [filteredData, setFilteredData] = useState<LoanData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let statusParam = "";
                switch (activeTab) {
                    case 'aprobados':
                        statusParam = "Aprobado";
                        break;
                    case 'aplazados':
                        statusParam = "Aplazado";
                        break;
                    case 'cambio':
                        statusParam = "New-cantity";
                        break;
                    default:
                        statusParam = "Aprobado";
                }

                const response = await axios.get(`/api/dash/status?status=${statusParam}&page=1&pageSize=5`);
                console.log(response.data)

                if (response.data.success && Array.isArray(response.data.data)) {
                    setLoanData(response.data.data);
                } else {
                    setLoanData([]); // Aseguramos que loanData siempre sea un array
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoanData([]); // En caso de error, aseguramos que no sea undefined
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);


    useEffect(() => {
        if (loanData.length === 0) return;
        const filtered = loanData.filter(item =>
            item.document.number.includes(searchQuery)
        );
        setFilteredData(filtered);
    }, [searchQuery, loanData]);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format currency
    const formatCurrency = (value: string) => {
        const amount = parseFloat(value);
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <SidebarLayout>
            <div className="bg-white rounded-lg shadow-sm border h-full border-gray-100">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">Prestaciones activas</h2>
                    </div>

                    {/* Tab navigation */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('aprobados')}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'aprobados'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Aprobados
                        </button>

                        <button
                            onClick={() => setActiveTab('aplazados')}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'aplazados'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Aplazados
                        </button>

                        <button
                            onClick={() => setActiveTab('cambio')}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'cambio'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Cambio de Cantidad
                        </button>
                    </div>

                    {/* Search input */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ingresa el número de cédula"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Content area */}
                    <div className="py-4">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                            </div>
                        ) : filteredData.length > 0 ? (
                            <div className="space-y-4">
                                {filteredData.map((item) => (
                                    <div key={item.loanApplication.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                            <div className="mb-3 md:mb-0">
                                                <div className="flex items-center mb-2">
                                                    <FiUser className="mr-2 text-gray-500" />
                                                    <h3 className="font-semibold text-lg">{`${item.user.names} ${item.user.firstLastName} ${item.user.secondLastName}`}</h3>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FiFileText className="mr-2" />
                                                    <span>{`${item.document.typeDocument}: ${item.document.number}`}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex items-center mb-1">
                                                    <FiDollarSign className="mr-1 text-gray-500" />
                                                    <span className="font-medium">{formatCurrency(item.loanApplication.cantity)}</span>
                                                </div>
                                                {item.loanApplication.newCantity && (
                                                    <div className="flex items-center text-sm text-blue-600">
                                                        <span className="font-medium">Nuevo: {formatCurrency(item.loanApplication.newCantity)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap justify-between items-center">
                                            <div className="flex items-center text-sm text-gray-600 mb-2 md:mb-0">
                                                <FiCalendar className="mr-1" />
                                                <span>{formatDate(item.loanApplication.created_at)}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <span className="text-sm mr-2">{item.user.currentCompanie}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                    ${item.loanApplication.status === 'Aprobado' ? 'bg-green-100 text-green-800' :
                                                        item.loanApplication.status === 'Aplazado' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {item.loanApplication.status}
                                                </span>
                                            </div>
                                        </div>

                                        {(item.loanApplication.reasonChangeCantity || item.loanApplication.reasonReject) && (
                                            <div className="mt-2 text-sm italic text-gray-600 border-t pt-2">
                                                <span>Motivo: {item.loanApplication.reasonChangeCantity || item.loanApplication.reasonReject}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="text-gray-400 mb-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16 opacity-40"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium text-center">No hay solicitudes en este estado</p>
                                <p className="text-gray-400 text-sm text-center mt-1">
                                    Las solicitudes aparecerán aquí cuando estén disponibles
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    )
}

export default ActiveSection;