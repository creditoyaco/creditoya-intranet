"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ScalarLoanApplication, Status } from '@/types/loan';
import { ScalarClient } from '@/types/client';

interface GeneratedDocument {
  id: string;
  loanId: string;
  uploadId: string;
  publicUrl: string;
  documentTypes: string[];
  created_at: string;
  updated_at: string;
  downloadCount: number;
  lastDownloaded?: string;
}

interface DocumentParams {
  documentType: string;
  signature: string;
  numberDocument: string;
  name?: string;
  autoDownload?: boolean;
}

interface DocumentWithLoan {
  document: GeneratedDocument;
  loanApplication: {
    id: string;
    status: Status;
    amount: number;
    created_at: string;
    user: ScalarClient;
  };
  downloadCount: number;
  lastDownloaded?: string;
}

function useProof() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvedLoans, setApprovedLoans] = useState<ScalarLoanApplication[]>([]);
  const [postponedLoans, setPostponedLoans] = useState<ScalarLoanApplication[]>([]);
  const [pendingDocumentsLoans, setPendingDocumentsLoans] = useState<any>({ count: 0, loans: [] });
  const [selectedStatus, setSelectedStatus] = useState<Status>('Aprobado');
  const [generatingDocuments, setGeneratingDocuments] = useState(false);
  const [allDocuments, setAllDocuments] = useState<DocumentWithLoan[]>([]);
  const [downloadedDocuments, setDownloadedDocuments] = useState<DocumentWithLoan[]>([]);
  const [neverDownloadedDocuments, setNeverDownloadedDocuments] = useState<DocumentWithLoan[]>([]);
  const [batchGenerationStatus, setBatchGenerationStatus] = useState<{
    inProgress: boolean;
    results: any | null;
  }>({
    inProgress: false,
    results: null
  });

  const fetchLoans = async (status: Status) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/dash/pdfs/loans-with-documents?status=${status}`);

      if (status === 'Aprobado') {
        setApprovedLoans(response.data.data);
      } else if (status === 'Aplazado') {
        setPostponedLoans(response.data.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al obtener préstamos');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDocumentsLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dash/pdfs/pending-documents');
      setPendingDocumentsLoans(response.data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al obtener documentos pendientes');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanDocuments = async (loanId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/dash/pdfs/loan-documents?loanId=${loanId}`);
      return response.data.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al obtener documentos del préstamo');
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateDocuments = async (
    documentsParams: DocumentParams[],
    userId: string,
    loanId: string
  ) => {
    try {
      setGeneratingDocuments(true);
      const response = await axios.post('/api/dash/pdfs/generate', {
        documentsParams,
        userId,
        loanId
      });

      await fetchLoans(selectedStatus);
      await fetchAllDocuments(); // Refresh document lists after generation

      return response.data.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al generar documentos');
      }
      return null;
    } finally {
      setGeneratingDocuments(false);
    }
  };

  const generateAllPendingDocuments = async () => {
    try {
      setBatchGenerationStatus({
        inProgress: true,
        results: null
      });

      const response = await axios.post('/api/dash/pdfs/generate-all-pending');

      await fetchPendingDocumentsLoans();
      await fetchLoans(selectedStatus);
      await fetchAllDocuments(); // Refresh document lists after generation

      setBatchGenerationStatus({
        inProgress: false,
        results: response.data
      });

      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al generar documentos pendientes');
      }
      setBatchGenerationStatus({
        inProgress: false,
        results: null
      });
      return null;
    }
  };

  // New methods for the new API endpoints
  const fetchAllDocuments = async (userId?: string, loanId?: string) => {
    try {
      setLoading(true);
      let url = '/api/dash/pdfs/all-documents';

      // Add query parameters if provided
      if (userId || loanId) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (loanId) params.append('loanId', loanId);
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      console.log(response)
      setAllDocuments(response.data.data);
      return response.data.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al obtener todos los documentos');
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchNeverDownloadedDocuments = async (userId?: string, loanId?: string) => {
    try {
      setLoading(true);
      let url = '/api/dash/pdfs/never-downloaded';

      // Add query parameters if provided
      if (userId || loanId) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (loanId) params.append('loanId', loanId);
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setNeverDownloadedDocuments(response.data.data);
      return response.data.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al obtener documentos no descargados');
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloadedDocuments = async (userId?: string, loanId?: string) => {
    try {
      setLoading(true);
      let url = '/api/dash/pdfs/downloaded';

      // Add query parameters if provided
      if (userId || loanId) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (loanId) params.append('loanId', loanId);
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setDownloadedDocuments(response.data.data);
      return response.data.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al obtener documentos descargados');
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const downloadDocumentById = async (documentId: string) => {
    try {
      // Use window.open for direct download from the API
      window.open(`/api/dash/pdfs/document?document_id=${documentId}`, '_blank');

      // Refresh document lists after download
      await fetchAllDocuments();
      await fetchDownloadedDocuments();
      await fetchNeverDownloadedDocuments();

      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al descargar documento');
      }
      return false;
    }
  };

  const toggleStatus = (status: Status) => {
    setSelectedStatus(status);
  };

  const downloadDocument = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'loan-documents.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFullName = (user: ScalarClient) => {
    return `${user.names} ${user.firstLastName} ${user.secondLastName || ''}`.trim();
  };

  useEffect(() => {
    fetchLoans(selectedStatus);
  }, [selectedStatus]);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchAllDocuments();
      await fetchDownloadedDocuments();
      await fetchNeverDownloadedDocuments();
    };

    loadInitialData();
  }, []);

  return {
    loading,
    error,
    approvedLoans,
    postponedLoans,
    pendingDocumentsLoans,
    selectedStatus,
    generatingDocuments,
    batchGenerationStatus,
    allDocuments,
    downloadedDocuments,
    neverDownloadedDocuments,
    toggleStatus,
    fetchPendingDocumentsLoans,
    fetchLoanDocuments,
    generateDocuments,
    downloadDocument,
    formatDate,
    getFullName,
    generateAllPendingDocuments,
    // New methods
    fetchAllDocuments,
    fetchDownloadedDocuments,
    fetchNeverDownloadedDocuments,
    downloadDocumentById,
  };
}

export default useProof;