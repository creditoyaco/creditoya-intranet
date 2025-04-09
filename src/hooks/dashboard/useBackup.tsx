"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

// Define interfaces for the response structures
interface BackupInfo {
  name: string;
  timeCreated: string;
  size: string;
}

interface BackupResponse {
  success: boolean;
  message?: string;
  path?: string;
}

interface ListBackupsResponse {
  success: boolean;
  backups?: BackupInfo[];
  message?: string;
}

interface DownloadUrlResponse {
  success: boolean;
  downloadUrl?: string;
  message?: string;
}

interface RestoreBackupResult {
  success: boolean;
  message?: string;
}

interface HandleDownloadBackupResult {
  success: boolean;
  downloadUrl?: string;
  message?: string;
}
interface MessageState {
  type: string;
  text: string;
}

function useBackup() {
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingBackup, setIsCreatingBackup] = useState<boolean>(false);
  const [lastBackup, setLastBackup] = useState<BackupInfo | null>(null);

  const [restoringBackupPath, setRestoringBackupPath] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });

  // Load backups on component mount
  useEffect(() => {
    getAllBackups();
  }, []);

  // Fetch all backups from the API
  const getAllBackups = async (): Promise<ListBackupsResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ListBackupsResponse>('/api/dash/backup');
      const data = response.data;

      console.log("respaldes: ", data)
      
      setBackups(data.backups || []);

      // Set the last backup if we have any backups
      if (data.backups && data.backups.length > 0) {
        setLastBackup(data.backups[0]);
      }

      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error retrieving backups');
        return { success: false, message: err.message };
      }
      setError('Unknown error occurred');
      return { success: false, message: 'Unknown error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // Create a new backup now
  const createBackupNow = async (): Promise<BackupResponse> => {
    setIsCreatingBackup(true);
    setError(null);

    try {
      const response = await axios.post<BackupResponse>('/api/dash/backup');
      // Refresh the list after creating a new backup
      await getAllBackups();
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error creating backup');
        return { success: false, message: err.message };
      }
      setError('Unknown error occurred');
      return { success: false, message: 'Unknown error occurred' };
    } finally {
      setIsCreatingBackup(false);
    }
  };

  // Restore from a specific backup
  const restoreBackup = async (backupPath: string): Promise<RestoreBackupResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<RestoreBackupResult>('/api/dash/backup/restore', { backupPath });
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error restoring backup');
        return { success: false, message: err.message };
      }
      setError('Unknown error occurred');
      return { success: false, message: 'Unknown error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // Generate download URL for a backup
  const getDownloadUrl = async (backupPath: string): Promise<DownloadUrlResponse> => {
    try {
      const response = await axios.get<DownloadUrlResponse>(`/api/backups/download?path=${encodeURIComponent(backupPath)}`);
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error generating download URL');
        return { success: false, message: err.message };
      }
      setError('Unknown error occurred');
      return { success: false, message: 'Unknown error occurred' };
    }
  };

  const handleCreateBackup = async (): Promise<void> => {
    setMessage({ type: 'info', text: 'Creando respaldo...' });
    const result = await createBackupNow();

    if (result.success) {
      setMessage({ type: 'success', text: 'Respaldo creado exitosamente' });
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al crear respaldo' });
    }

    // Clear message after 5 seconds
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleRestoreBackup = async (backupPath: string): Promise<void> => {
    if (window.confirm('¿Está seguro que desea restaurar este punto de respaldo? Esta acción reemplazará todos los datos actuales.')) {
      setRestoringBackupPath(backupPath);
      setMessage({ type: 'info', text: 'Restaurando desde respaldo...' });

      const result: RestoreBackupResult = await restoreBackup(backupPath);

      if (result.success) {
        setMessage({ type: 'success', text: 'Base de datos restaurada exitosamente' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Error al restaurar respaldo' });
      }

      setRestoringBackupPath(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleDownloadBackup = async (backupPath: string): Promise<void> => {
    setMessage({ type: 'info', text: 'Generando enlace de descarga...' });

    const result: DownloadUrlResponse = await getDownloadUrl(backupPath);

    if (result.success && result.downloadUrl) {
      // Open download in new tab
      window.open(result.downloadUrl, '_blank');
      setMessage({ type: 'success', text: 'Descarga iniciada' });
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al generar enlace de descarga' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'del' yyyy, HH:mm");
    } catch (e) {
      return "Fecha desconocida";
    }
  };

  return {
    backups,
    loading,
    error,
    isCreatingBackup,
    lastBackup,
    restoringBackupPath,
    message,

    getAllBackups,
    createBackupNow,
    restoreBackup,
    getDownloadUrl,
    handleCreateBackup,
    handleRestoreBackup,
    handleDownloadBackup,
    formatDate
  };
}

export default useBackup;