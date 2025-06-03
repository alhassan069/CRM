import { useState } from 'react';
import { getDealCoachAdvice } from '../../services/ai.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
/**
 * Deal Coach Panel component for displaying AI-generated advice
 * @param {Object} props - Component props
 * @param {string} props.leadId - The lead ID
 */
const DealCoachPanel = ({ leadId }) => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdvice = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getDealCoachAdvice(leadId);
      setAdvice(response.advice);
    } catch (error) {
      console.error('Error fetching deal coach advice:', error);
      setError('Failed to get AI advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Deal Coach AI</span>
          {!loading && advice && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchAdvice} 
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          AI-generated next steps to improve conversion chances
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        {!advice && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground text-sm mb-4 text-center">
              Get AI-powered advice on how to convert this lead
            </p>
            <Button onClick={fetchAdvice}>
              Get AI Coach Advice
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
              onClick={fetchAdvice} 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
        
        {advice && !loading && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {advice.split('\n').map((paragraph, index) => {
              // Check if the paragraph is a bullet point
              if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
                return <li key={index}>{paragraph.replace(/^[-•*]\s+/, '')}</li>;
              }
              return <Markdown key={index} >{paragraph}</Markdown>;
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealCoachPanel; 