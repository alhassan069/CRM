import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import api from '../../lib/axios';

const getISTDateInISO = () => {
    // Get current date in IST (UTC+5:30)
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    return istTime.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm 
}

const ActivityForm = ({ leadId, onSuccess, onCancel }) => {

  const [formData, setFormData] = useState({
    type: '',
    activity_time: getISTDateInISO(),
    duration_mins: '',
    outcome: '',
    summary: '',
    full_notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/api/leads/${leadId}/activities`, formData);
      onSuccess(response.data.activity);
    } catch (err) {
      console.error('Error creating activity:', err);
      setError(err.response?.data?.message || 'Failed to create activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Activity Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Activity Type <span className="text-red-500">*</span></Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleSelectChange('type', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select activity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Call">Call</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="Meeting">Meeting</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Activity Time */}
      <div className="space-y-2">
        <Label htmlFor="activity_time">Date & Time <span className="text-red-500">*</span></Label>
        <Input
          type="datetime-local"
          id="activity_time"
          name="activity_time"
          value={formData.activity_time}
          onChange={handleChange}
          required
        />
      </div>
      
      {/* Duration (only for calls) */}
      {formData.type === 'Call' && (
        <div className="space-y-2">
          <Label htmlFor="duration_mins">Duration (minutes)</Label>
          <Input
            type="number"
            id="duration_mins"
            name="duration_mins"
            value={formData.duration_mins}
            onChange={handleChange}
            min="1"
            placeholder="Duration in minutes"
          />
        </div>
      )}
      
      {/* Outcome */}
      <div className="space-y-2">
        <Label htmlFor="outcome">Outcome <span className="text-red-500">*</span></Label>
        <Select
          value={formData.outcome}
          onValueChange={(value) => handleSelectChange('outcome', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select outcome" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Successful">Successful</SelectItem>
            <SelectItem value="Unsuccessful">Unsuccessful</SelectItem>
            <SelectItem value="Left message">Left message</SelectItem>
            <SelectItem value="No answer">No answer</SelectItem>
            <SelectItem value="Rescheduled">Rescheduled</SelectItem>
            <SelectItem value="Follow-up needed">Follow-up needed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Summary */}
      <div className="space-y-2">
        <Label htmlFor="summary">Summary <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Brief summary of the activity"
          required
          maxLength="255"
        />
      </div>
      
      {/* Full Notes */}
      <div className="space-y-2">
        <Label htmlFor="full_notes">Detailed Notes</Label>
        <Textarea
          id="full_notes"
          name="full_notes"
          value={formData.full_notes}
          onChange={handleChange}
          placeholder="Add detailed notes about this activity..."
          rows={4}
        />
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Activity'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm; 