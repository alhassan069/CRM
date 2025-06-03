import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Switch } from '../../components/ui/switch';

const NewLeadForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    doctor_name: '',
    clinic_name: '',
    specialty: '',
    contact_number: '',
    email: '',
    city: '',
    source_of_lead: '',
    initial_notes: '',
    years_of_experience: '',
    clinic_type: '',
    preferred_comm_channel: '',
    estimated_patient_volume: '',
    uses_existing_emr: false,
    specific_pain_points: '',
    referral_source: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle switch change
  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Convert numeric fields to numbers
      const dataToSubmit = {
        ...formData,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
        estimated_patient_volume: formData.estimated_patient_volume ? parseInt(formData.estimated_patient_volume) : null,
      };
      
      const response = await api.post('/api/leads', dataToSubmit);
      
      // Navigate to the new lead's profile page
      navigate(`/leads/${response.data.lead.id}`);
    } catch (err) {
      console.error('Error creating lead:', err);
      setError('Failed to create lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
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
        <h1 className="text-2xl font-bold">Create New Lead</h1>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the doctor and clinic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Doctor Name</Label>
                  <Input
                    id="doctor_name"
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clinic_name">Clinic Name</Label>
                  <Input
                    id="clinic_name"
                    name="clinic_name"
                    value={formData.clinic_name}
                    onChange={handleChange}
                    placeholder="City Health Clinic"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="Cardiology"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input
                    id="contact_number"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="years_of_experience">Years of Experience</Label>
                  <Input
                    id="years_of_experience"
                    name="years_of_experience"
                    type="number"
                    min="0"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimated_patient_volume">Estimated Patient Volume</Label>
                  <Input
                    id="estimated_patient_volume"
                    name="estimated_patient_volume"
                    type="number"
                    min="0"
                    value={formData.estimated_patient_volume}
                    onChange={handleChange}
                    placeholder="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>More information about the lead</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinic_type">Clinic Type</Label>
                  <Select
                    value={formData.clinic_type}
                    onValueChange={(value) => handleSelectChange('clinic_type', value)}
                  >
                    <SelectTrigger id="clinic_type">
                      <SelectValue placeholder="Select clinic type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-doctor">Single Doctor</SelectItem>
                      <SelectItem value="multi-specialty">Multi-Specialty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferred_comm_channel">Preferred Communication</Label>
                  <Select
                    value={formData.preferred_comm_channel}
                    onValueChange={(value) => handleSelectChange('preferred_comm_channel', value)}
                  >
                    <SelectTrigger id="preferred_comm_channel">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source_of_lead">Source of Lead</Label>
                  <Select
                    value={formData.source_of_lead}
                    onValueChange={(value) => handleSelectChange('source_of_lead', value)}
                  >
                    <SelectTrigger id="source_of_lead">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Form">Website Form</SelectItem>
                      <SelectItem value="Cold Call">Cold Call</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Medical Conference">Medical Conference</SelectItem>
                      <SelectItem value="Blogs">Blogs</SelectItem>
                      <SelectItem value="Youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referral_source">Referral Source</Label>
                  <Input
                    id="referral_source"
                    name="referral_source"
                    value={formData.referral_source}
                    onChange={handleChange}
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="uses_existing_emr"
                      checked={formData.uses_existing_emr}
                      onCheckedChange={(checked) => handleSwitchChange('uses_existing_emr', checked)}
                    />
                    <Label htmlFor="uses_existing_emr">Uses Existing EMR/App</Label>
                  </div>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="specific_pain_points">Specific Pain Points</Label>
                  <Textarea
                    id="specific_pain_points"
                    name="specific_pain_points"
                    value={formData.specific_pain_points}
                    onChange={handleChange}
                    placeholder="Enter any specific pain points or challenges the doctor is facing"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="initial_notes">Initial Notes</Label>
                  <Textarea
                    id="initial_notes"
                    name="initial_notes"
                    value={formData.initial_notes}
                    onChange={handleChange}
                    placeholder="Enter any additional notes about this lead"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/leads')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Lead'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewLeadForm; 