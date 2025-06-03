import { useState } from 'react';
import { getObjectionHandler } from '../../services/ai.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';

/**
 * Objection Handler Panel component for displaying AI-generated responses to objections
 */
const ObjectionHandlerPanel = () => {
  const [objection, setObjection] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!objection.trim()) {
      setError('Please enter an objection');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await getObjectionHandler(objection);
      setResponses(response.responses);
    } catch (error) {
      console.error('Error fetching objection handler responses:', error);
      setError('Failed to generate responses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b pb-3">
        <CardTitle className="text-lg">Objection Handler</CardTitle>
        <CardDescription>
          Get AI-suggested responses to customer objections
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter the customer's objection here..."
              value={objection}
              onChange={(e) => setObjection(e.target.value)}
              className="min-h-[80px]"
              disabled={loading}
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
          
          <Button type="submit" disabled={loading || !objection.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Responses...
              </>
            ) : 'Get Response Suggestions'}
          </Button>
        </form>
        
        {responses.length > 0 && !loading && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-sm">Suggested Responses:</h4>
            <ol className="space-y-4 list-decimal pl-5">
              {responses.map((response, index) => (
                <li key={index} className="pl-1">
                  <p className="text-sm">{response}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObjectionHandlerPanel; 