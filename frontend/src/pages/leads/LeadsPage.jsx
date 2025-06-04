import React from 'react';
import LeadsTable from './LeadsTable';
import UploadCsvModal from '../../components/leads/UploadCsvModal';
import { useAuth } from '../../context/AuthContext';
const LeadsPage = () => {
  // For MVP, get role from localStorage (replace with context if available)
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-md font-bold">Bulk Upload</p>
        {isAdmin && <UploadCsvModal />}
      </div>
      <LeadsTable />
    </div>
  );
};

export default LeadsPage; 