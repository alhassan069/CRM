import { useState } from 'react';
import { getCustomerPersona } from '../../services/ai.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, RefreshCw } from 'lucide-react';

/**
 * Customer Persona Panel component for displaying AI-generated persona
 * @param {Object} props - Component props
 * @param {string} props.leadId - The lead ID
 */
const CustomerPersonaPanel = ({ leadId }) => {
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPersona = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getCustomerPersona(leadId);
      setPersona(response.persona);
    } catch (error) {
      console.error('Error fetching customer persona:', error);
      setError('Failed to generate customer persona. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Customer Persona</span>
          {!loading && persona && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchPersona} 
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          AI-generated behavioral profile based on interactions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        {!persona && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground text-sm mb-4 text-center">
              Generate a behavioral profile to better understand this lead
            </p>
            <Button onClick={fetchPersona}>
              Generate Customer Persona
            </Button>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 p-4 rounded-md">
            <p className="text-destructive font-medium">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchPersona} 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
        
        {persona && !loading && (
          <div className="space-y-4">
            {persona.error ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">{persona.raw}</p>
              </div>
            ) : (
              <>
                {Object.entries(persona).map(([key, value]) => (
                  <div key={key} className="border-b pb-2 last:border-0">
                    <h4 className="font-medium capitalize text-sm text-muted-foreground">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-sm mt-1">{value}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerPersonaPanel; 