"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useBackup from "@/hooks/dashboard/useBackup";
import { MdOutlineSettingsBackupRestore, MdRestore, MdDownload } from "react-icons/md";

function BackupsComponent() {
  const {
    backups,
    loading,
    error,
    isCreatingBackup,
    lastBackup,
    restoringBackupPath,
    message,
    handleCreateBackup,
    handleRestoreBackup,
    handleDownloadBackup,
    formatDate
  } = useBackup();

  return (
    <SidebarLayout>
      <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Puntos de recuperación</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona los puntos de recuperación de la base de datos en caso de pérdidas futuras</p>
        </header>

        {message.text && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'error' ? 'bg-red-100 text-red-700' :
            message.type === 'success' ? 'bg-green-100 text-green-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-row justify-between bg-white shadow-sm rounded-md p-4 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Último punto de respaldo</h3>
            <p className="text-sm text-gray-500">
              {lastBackup ? formatDate(lastBackup.timeCreated) : "No hay respaldos disponibles"}
            </p>
          </div>
          <div className="grid place-content-center">
            <button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className={`px-3 py-1 flex flex-row gap-1 hover:text-black text-gray-500 cursor-pointer border border-transparent hover:border-gray-300 rounded-md ${isCreatingBackup ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="grid place-content-center">
                <MdOutlineSettingsBackupRestore className="drop-shadow-md" />
              </div>
              <p className="text-sm pb-0.5">
                {isCreatingBackup ? 'Creando...' : 'Crear respaldo'}
              </p>
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-md overflow-hidden">
          <h3 className="text-lg font-medium text-gray-800 p-4 border-b">Respaldos disponibles</h3>
          
          {loading ? (
            <div className="text-center p-8 text-gray-500">Cargando respaldos...</div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">{error}</div>
          ) : backups.length === 0 ? (
            <div className="text-center p-8 text-gray-500">No hay respaldos disponibles</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de creación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {backups.map((backup, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{backup.name.split('/').pop()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(backup.timeCreated)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownloadBackup(backup.name)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <MdDownload /> Descargar
                          </button>
                          <button
                            onClick={() => handleRestoreBackup(backup.name)}
                            disabled={restoringBackupPath === backup.name}
                            className={`text-amber-600 hover:text-amber-900 flex items-center gap-1 ${
                              restoringBackupPath === backup.name ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <MdRestore /> {restoringBackupPath === backup.name ? 'Restaurando...' : 'Restaurar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

export default BackupsComponent;