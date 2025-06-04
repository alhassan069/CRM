import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Alert} from '../ui/alert';
import api from '@/lib/axios';

const SAMPLE_CSV_URL = '/sample-leads.csv';

export default function UploadCsvModal({ onUploadSuccess }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setLoading(false);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log(formData);
      const res = await api.post('/api/leads/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status !== 200) throw new Error(data.message || 'Upload failed');
      const data = res.data;
      setResult(data);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Upload CSV</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogTitle>Upload Leads via CSV</DialogTitle>
        <DialogDescription>
          <div className="mb-2">Upload a CSV file to bulk import leads. All leads will be assigned to you (admin) by default.</div>
          <div className="mb-2 text-sm text-gray-500">Required columns: doctor_name, clinic_name, specialty, contact_number, email, city, source_of_lead, initial_notes, years_of_experience, clinic_type, preferred_comm_channel, estimated_patient_volume, uses_existing_emr, specific_pain_points, referral_source</div>
          <a href={SAMPLE_CSV_URL} className="text-blue-600 underline text-sm" download>Download sample CSV</a>
        </DialogDescription>
        <div className="my-4">
          <Input type="file" accept=".csv,text/csv" onChange={handleFileChange} disabled={loading} />
        </div>
        {error && <Alert variant="destructive">{error}</Alert>}
        {result && (
          <div className="my-2">
            <Alert variant="success">
              <div><b>Upload complete.</b></div>
              <div>Leads created: {result.created}</div>
              <div>Failed rows: {result.failed}</div>
              {result.errors && result.errors.length > 0 && (
                <div className="mt-2">
                  <div className="font-semibold mb-1">Errors:</div>
                  <ul className="max-h-40 overflow-y-auto text-xs bg-gray-50 rounded p-2 border border-gray-200">
                    {result.errors.map((err, idx) => (
                      <li key={idx} className="mb-1">
                        Row {err.row}: {err.reason}
                        <pre className="bg-gray-100 rounded p-1 mt-1 whitespace-pre-wrap">{JSON.stringify(err.data, null, 2)}</pre>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Alert>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleUpload} disabled={!file || loading} loading={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 