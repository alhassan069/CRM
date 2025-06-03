import { useState } from 'react';
import { getWinLossReport } from '../../services/ai.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, RefreshCw } from 'lucide-react';

/**
 * Win-Loss Report Panel component for displaying AI-generated insights
 */
const WinLossReportPanel = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getWinLossReport();
      setInsights(response.insights);
    } catch (error) {
      console.error('Error fetching win-loss insights:', error);
      setError('Failed to generate win-loss insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Win-Loss Analysis</span>
          {!loading && insights && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchInsights} 
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          AI-generated insights on won and lost deals
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        {!insights && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground text-sm mb-4 text-center">
              Generate insights on patterns in your won and lost deals
            </p>
            <Button onClick={fetchInsights}>
              Run AI Analysis
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
              onClick={fetchInsights} 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
        
        {insights && !loading && (
          <div className="space-y-6">
            {insights.error ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">{insights.raw}</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Summary</h4>
                  <p className="text-sm">{insights.summary}</p>
                </div>
                
                {/* Win Factors */}
                <div>
                  <h4 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">
                    Key Win Factors
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {Array.isArray(insights.winFactors) ? (
                      insights.winFactors.map((factor, index) => (
                        <li key={index} className="text-sm">{factor}</li>
                      ))
                    ) : (
                      <li className="text-sm italic">No win factors available</li>
                    )}
                  </ul>
                </div>
                
                {/* Loss Factors */}
                <div>
                  <h4 className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">
                    Key Loss Factors
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {Array.isArray(insights.lossFactors) ? (
                      insights.lossFactors.map((factor, index) => (
                        <li key={index} className="text-sm">{factor}</li>
                      ))
                    ) : (
                      <li className="text-sm italic">No loss factors available</li>
                    )}
                  </ul>
                </div>
                
                {/* Recommendation */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                  <h4 className="font-medium text-sm mb-1 text-blue-600 dark:text-blue-400">
                    Recommendation
                  </h4>
                  <p className="text-sm">{insights.recommendation}</p>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WinLossReportPanel; 