import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ArrowLeft, Phone, Mail, MapPin, Building, User, Calendar, Users, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { format } from 'date-fns';
import ActivityLog from '../../components/activities/ActivityLog';
import { TaskList } from '../../components/tasks';
import { DealCoachPanel, CustomerPersonaPanel, ObjectionHandlerPanel } from '../../components/ai';

const LeadProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lead, setLead] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reasonForLoss, setReasonForLoss] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [assigningLead, setAssigningLead] = useState(false);
  const [selectedRep, setSelectedRep] = useState('');
  
  // Status color mapping
  const getStatusColor = (level) => {
    switch(level) {
      case 1: return 'bg-blue-100 text-blue-800'; // New Lead
      case 2: return 'bg-yellow-100 text-yellow-800'; // Contacted
      case 3: return 'bg-purple-100 text-purple-800'; // Demo Scheduled
      case 4: return 'bg-orange-100 text-orange-800'; // Post-Demo
      case 5: return 'bg-green-100 text-green-800'; // Converted
      case 6: return 'bg-red-100 text-red-800'; // Lost
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fetch lead data
  const fetchLead = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/leads/${id}`);
      setLead(response.data);
      setNotes(response.data.initial_notes || '');
      if (response.data.status) {
        setSelectedStatus(response.data.status.id.toString());
      }
      setReasonForLoss(response.data.reason_for_loss || '');
      if (response.data.assigned_to) {
        setSelectedRep(response.data.assigned_to.toString());
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching lead:', err);
      setError('Failed to fetch lead details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch statuses
  const fetchStatuses = async () => {
    try {
      const response = await api.get('/api/leads/statuses');
      setStatuses(response.data);
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  // Fetch sales reps
  const fetchSalesReps = async () => {
    try {
      const response = await api.get('/api/users');
      // Filter to only show sales reps
      const reps = response.data.filter(user => user.role.name === 'rep');
      setSalesReps(reps);
    } catch (err) {
      console.error('Error fetching sales reps:', err);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchLead();
    fetchStatuses();
    if (user.role === 'admin') {
      fetchSalesReps();
    }
  }, [id, user.role]);
  
  // Handle notes update
  const handleNotesUpdate = async () => {
    setSavingNotes(true);
    try {
      await api.put(`/api/leads/${id}`, {
        initial_notes: notes
      });
      // Update local state
      setLead(prev => ({ ...prev, initial_notes: notes }));
    } catch (err) {
      console.error('Error updating notes:', err);
      setError('Failed to update notes. Please try again.');
    } finally {
      setSavingNotes(false);
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async () => {
    setSavingStatus(true);
    try {
      const payload = {
        status_id: parseInt(selectedStatus)
      };
      
      // If new status is "Lost", include reason for loss
      const newStatus = statuses.find(s => s.id.toString() === selectedStatus);
      if (newStatus && newStatus.level === 6) {
        if (!reasonForLoss) {
          setError('Please select a reason for loss');
          setSavingStatus(false);
          return;
        }
        payload.reason_for_loss = reasonForLoss;
      }
      
      const response = await api.patch(`/api/leads/${id}/status`, payload);
      
      // Update local state
      setLead(response.data.lead);
      setError(null);
    } catch (err) {
      console.error('Error updating status:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update status. Please try again.');
      }
    } finally {
      setSavingStatus(false);
    }
  };

  // Handle lead assignment
  const handleLeadAssignment = async () => {
    if (!selectedRep) return;
    
    setAssigningLead(true);
    try {
      const response = await api.patch(`/api/leads/${id}/assign`, {
        user_id: parseInt(selectedRep)
      });
      
      // Update local state
      setLead(response.data.lead);
      setError(null);
    } catch (err) {
      console.error('Error assigning lead:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to assign lead. Please try again.');
      }
    } finally {
      setAssigningLead(false);
    }
  };
  
  // Filter available statuses based on current status level
  const getAvailableStatuses = () => {
    if (!lead || !lead.status || !statuses.length) return [];
    
    return statuses.filter(status => {
      // Can move to same level or higher level
      return status.level >= lead.status.level;
    });
  };
  
  // Check if status is "Lost" (level 6)
  const isLostStatus = (statusId) => {
    const status = statuses.find(s => s.id.toString() === statusId);
    return status && status.level === 6;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error && !lead) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/leads')}
          className="mt-4"
        >
          Back to Leads
        </Button>
      </div>
    );
  }
  
  if (!lead) {
    return (
      <div className="text-center p-4">
        <p>Lead not found</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/leads')}
          className="mt-4"
        >
          Back to Leads
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/leads')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {lead.doctor_name || 'Unnamed Lead'}
        </h1>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Lead details and status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Contact info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{lead.doctor_name || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">{lead.specialty || 'No specialty'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{lead.clinic_name || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">
                  {lead.clinic_type === 'single-doctor' ? 'Single Doctor Clinic' : 
                   lead.clinic_type === 'multi-specialty' ? 'Multi-Specialty Clinic' : 'Unknown'}
                </p>
              </div>
            </div>
            
            {lead.contact_number && (
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p>{lead.contact_number}</p>
              </div>
            )}
            
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p>{lead.email}</p>
              </div>
            )}
            
            {lead.city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <p>{lead.city}</p>
              </div>
            )}
            
            {lead.years_of_experience && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <p>{lead.years_of_experience} years of experience</p>
              </div>
            )}
            
            {lead.estimated_patient_volume && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <p>~{lead.estimated_patient_volume} patients</p>
              </div>
            )}
            
            {lead.preferred_comm_channel && (
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <p>Prefers {lead.preferred_comm_channel}</p>
              </div>
            )}
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Created: {format(new Date(lead.created_at), 'PPP')}</p>
              <p className="text-sm text-muted-foreground">Last updated: {format(new Date(lead.updated_at), 'PPP')}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Middle column - Status */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status</CardTitle>
            <CardDescription>Current status and transition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Current Status</p>
              {lead.status ? (
                <Badge className={`${getStatusColor(lead.status.level)} text-sm`}>
                  {lead.status.label}
                </Badge>
              ) : (
                <Badge variant="outline">No Status</Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Update Status</p>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                disabled={savingStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableStatuses().map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Reason for loss dropdown - only show if selected status is "Lost" */}
            {isLostStatus(selectedStatus) && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">Reason for Loss <span className="text-red-500">*</span></p>
                <Select
                  value={reasonForLoss}
                  onValueChange={setReasonForLoss}
                  disabled={savingStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Budget">Budget</SelectItem>
                    <SelectItem value="Competitor">Competitor</SelectItem>
                    <SelectItem value="No Need">No Need</SelectItem>
                    <SelectItem value="Not a Good Fit">Not a Good Fit</SelectItem>
                    <SelectItem value="Unresponsive">Unresponsive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              onClick={handleStatusUpdate}
              disabled={selectedStatus === (lead.status?.id.toString() || '') || savingStatus}
              className="w-full mt-2"
            >
              {savingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>

            {/* Lead Assignment - Only show for admins */}
            {user.role === 'admin' && (
              <div className="space-y-2 mt-6 pt-6 border-t">
                <p className="text-sm font-medium">Assign Lead</p>
                <Select
                  value={selectedRep}
                  onValueChange={setSelectedRep}
                  disabled={assigningLead}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales rep" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesReps.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id.toString()}>
                        {rep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleLeadAssignment}
                  disabled={selectedRep === (lead.assigned_to?.toString() || '') || assigningLead}
                  className="w-full mt-2"
                >
                  {assigningLead ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Lead'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Right column - Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Add or update notes for this lead</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              className="min-h-[150px]"
            />
            <Button 
              onClick={handleNotesUpdate}
              disabled={savingNotes || notes === lead.initial_notes}
              className="w-full mt-4"
            >
              {savingNotes ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Notes'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for Activities and Tasks */}
      <Tabs defaultValue="activities" className="w-full">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="activities" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
              <CardDescription>Logged interactions with this lead</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLog leadId={id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks" className="py-4">
          <TaskList leadId={id} />
        </TabsContent>
        <TabsContent value="ai" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DealCoachPanel leadId={id} />
            <CustomerPersonaPanel leadId={id} />
          </div>
          <ObjectionHandlerPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadProfile; 