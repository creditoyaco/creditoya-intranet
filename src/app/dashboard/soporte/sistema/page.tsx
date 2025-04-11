"use client"

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";

function SystemAppsPage() {
    const router = useRouter();

    // Estado para los servicios y su status
    const [services, setServices] = useState([
        // { name: "Backend-core", status: "online", performance: "98%", lastCheck: "Hace 5 min" },
        // { name: "Aplicación clientes", status: "online", performance: "95%", lastCheck: "Hace 3 min" },
        // { name: "Aplicación intranet", status: "warning", performance: "87%", lastCheck: "Hace 2 min" },
        // { name: "Base de datos", status: "online", performance: "99%", lastCheck: "Hace 1 min" },
        { name: "Último Backup", status: "completed", performance: "", lastCheck: "Hace 2 horas" }
    ]);

    // Simulación de actualización de estados cada 30 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            // Aquí podrías hacer un fetch real a tu API
            // Simulamos cambios aleatorios para la demo
            const updatedServices = services.map(service => {
                const statuses = ["online", "warning", "offline"];
                const randomStatus = Math.random() > 0.8
                    ? statuses[Math.floor(Math.random() * statuses.length)]
                    : service.status;

                return {
                    ...service,
                    status: randomStatus,
                    lastCheck: "Hace 1 min"
                };
            });

            setServices(updatedServices);
        }, 30000);

        return () => clearInterval(interval);
    }, [services]);

    // Función para determinar el color según el estado
    const getStatusColor = (status: any) => {
        switch (status) {
            case "online":
                return "bg-green-500";
            case "warning":
                return "bg-yellow-500";
            case "offline":
                return "bg-red-500";
            case "completed":
                return "bg-blue-500";
            default:
                return "bg-gray-300";
        }
    };

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Estado del sistema</h1>
                    <p className="text-gray-500 text-sm mt-1">Mire en tiempo real el funcionamiento de los servicios y su rendimiento en el dia</p>
                </header>

                <div className="grid gap-4">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-4 ${getStatusColor(service.status)}`}></div>
                                <div>
                                    <h3 className="font-medium">{service.name}</h3>
                                    <p className="text-sm text-gray-500">{service.lastCheck}</p>
                                </div>
                            </div>

                            {service.performance && (
                                <div className="text-right">
                                    <span className="font-medium">{service.performance}</span>
                                    <p className="text-sm text-gray-500">rendimiento</p>
                                </div>
                            )}

                            {!service.performance && service.name === "Último Backup" && (
                                <div className="text-right">
                                    <div className="flex flex-row">
                                        <p
                                        className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                                        onClick={() => router.push("/dashboard/soporte/sistema/backups")}
                                        >Administrar</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </SidebarLayout>
    )
}

export default SystemAppsPage;