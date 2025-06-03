import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Search, Plus, Loader2, ArrowUpDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';

const LeadsTable = () => {
  
  const [leads, setLeads] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Status color mapping
  const getStatusColor = (level) => {
    switch(level) {
      case 1: return 'bg-blue-100 text-blue-800 border-blue-200'; // New Lead
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Contacted
      case 3: return 'bg-purple-100 text-purple-800 border-purple-200'; // Demo Scheduled
      case 4: return 'bg-orange-100 text-orange-800 border-orange-200'; // Post-Demo
      case 5: return 'bg-green-100 text-green-800 border-green-200'; // Converted
      case 6: return 'bg-red-100 text-red-800 border-red-200'; // Lost
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      console.log('Fetching leads with params:', params);
      const response = await api.get('/api/leads', { params });
      console.log('Leads response:', response.data);
      setLeads(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        setError(`Failed to fetch leads: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Failed to fetch leads: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        setError(`Failed to fetch leads: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch statuses
  const fetchStatuses = async () => {
    try {
      console.log('Fetching statuses');
      const response = await api.get('/api/leads/statuses');
      console.log('Statuses response:', response.data);
      setStatuses(response.data);
    } catch (err) {
      console.error('Error fetching statuses:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
      }
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    console.log('Initial useEffect running');
    fetchStatuses();
  }, []);
  
  // Fetch leads when filters change
  useEffect(() => {
    console.log('Filter useEffect running with:', { page: pagination.page, statusFilter });
    if (pagination.page !== undefined) {
      fetchLeads();
    }
  }, [pagination.page, statusFilter]);
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLeads();
  };
  
  // Handle row click to navigate to lead detail
  const handleRowClick = (leadId) => {
    navigate(`/leads/${leadId}`);
  };
  
  // Handle create new lead
  const handleCreateLead = () => {
    navigate('/leads/new');
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={handleCreateLead} className="flex items-center gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          New Lead
        </Button>
      </div>
      
      <Card className="p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-1/3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctor or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 focus-visible:ring-2 focus-visible:ring-offset-1"
              />
            </form>
          </div>
          <div className="w-full sm:w-1/4">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-offset-1">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id.toString()}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" onClick={handleSearch} className="shadow-sm">
            Search
          </Button>
        </div>
      </Card>
      
      {loading ? (
        <Card className="flex justify-center items-center h-64 shadow-sm bg-white/50 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      ) : error ? (
        <Card className="text-center text-red-500 p-6 shadow-sm bg-red-50">
          {error}
        </Card>
      ) : (
        <>
          <Card className="shadow-sm overflow-hidden border-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-b border-muted">
                    <TableHead className="font-semibold text-sm py-4 whitespace-nowrap text-left" >
                      <div className="flex items-center gap-1">
                        Lead ID
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-sm py-4 whitespace-nowrap text-left">
                      <div className="flex items-center gap-1">
                        Doctor Name
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-sm whitespace-nowrap text-left">Clinic Name</TableHead>
                    <TableHead className="font-semibold text-sm whitespace-nowrap text-left">Specialty</TableHead>
                    <TableHead className="font-semibold text-sm whitespace-nowrap text-left">City</TableHead>
                    <TableHead className="font-semibold text-sm whitespace-nowrap text-left">Status</TableHead>
                    <TableHead className="font-semibold text-sm whitespace-nowrap text-left">Last Activity</TableHead>
                    <TableHead className="font-semibold text-sm whitespace-nowrap text-left">Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!leads || leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                        No leads found
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow 
                        key={lead.id} 
                        className="cursor-pointer transition-colors hover:bg-muted/30"
                        onClick={() => handleRowClick(lead.id)}
                      >
                        <TableCell className="font-medium text-left">{lead.id || 'N/A'}</TableCell>
                        <TableCell className="font-medium text-left">{lead.doctor_name || 'N/A'}</TableCell>
                        <TableCell className="text-left">{lead.clinic_name || 'N/A'}</TableCell>
                        <TableCell className="text-left">{lead.specialty || 'N/A'}</TableCell>
                        <TableCell className="text-left">{lead.city || 'N/A'}</TableCell>
                        <TableCell className="text-left">
                          {lead.status ? (
                            <Badge className={`${getStatusColor(lead.status.level)} px-2 py-1 rounded-md font-medium border`}>
                              {lead.status.label}
                            </Badge>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-left">
                          {lead.updated_at ? 
                            formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true }) : 
                            'N/A'}
                        </TableCell>
                        <TableCell className="text-left">{lead.assignedUser?.name || 'Unassigned'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-muted-foreground">
                Showing {leads.length} of {pagination.total} leads
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="shadow-sm"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and pages around current
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                      );
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        <Button
                          variant={page === pagination.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`h-8 w-8 p-0 shadow-sm ${page === pagination.page ? 'font-medium' : ''}`}
                        >
                          {page}
                        </Button>
                        {index < array.length - 1 &&
                          array[index + 1] - page > 1 && (
                            <span className="mx-1 text-muted-foreground">...</span>
                          )}
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="shadow-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadsTable; 