import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { WinLossReportPanel } from '../../components/ai';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from '../../components/ui/chart';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Funnel,
  FunnelChart,
  LabelList,
} from 'recharts';

const funnelBarColor = '#3B82F6';
const colors = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFA1",
  "#A133FF", "#FF8C33", "#33FF8C", "#8C33FF", "#FF3333",
  "#33FF33", "#3333FF", "#FF33FF", "#33FFFF", "#FFFF33",
  "#FF6633", "#33FF66", "#6633FF", "#FF3366", "#33FF99",
  "#9933FF", "#FF9933", "#33FFCC", "#CC33FF", "#FFCC33",
  "#33CCFF", "#CCFF33", "#FF33CC", "#33CC99", "#99FF33",
  "#FF3399", "#3399FF", "#99FF99", "#FF9999", "#9999FF",
  "#FF66CC", "#66FFCC", "#CC66FF", "#FFCC66", "#66FF99",
  "#99CCFF", "#FF9966", "#66CCFF", "#CCFF66", "#FF6699",
  "#6699FF", "#99FF66", "#FF66FF", "#66FFFF", "#FFFF66"
]

const ConversionFunnelChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [finalData, setFinalData] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get('/api/reports/conversion-funnel')
      .then(res => setData(res.data.data || res.data))
      .catch(() => setError('Failed to load conversion funnel'))
      .finally(() => setLoading(false));
  }, []);


  if (loading) return <div className="h-64 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500 py-6 text-center">{error}</div>;
  if (!data || data.length === 0) return <div className="text-gray-500 py-6 text-center">No funnel data available.</div>;
  
  return (
    <ResponsiveContainer widdth={700} height={"90%"} >
      <FunnelChart>
        <Tooltip label={"Leads"} />
        <Funnel
          dataKey="count"
          data={data}
          isAnimationActive
          nameKey="status"
          fill={funnelBarColor}
        >
          <LabelList
            position="right"
            fill="#000"
            stroke="none"
            dataKey="status"
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
};

const ConvertedLeadsByRep = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/reports/leads-by-rep')
      .then(res => setData(res.data.data || res.data))
      .catch(() => setError('Failed to load rep conversions'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-24 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500 py-6 text-center">{error}</div>;
  if (!data || data.length === 0) return <div className="text-gray-500 py-6 text-center">No conversion data available.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Sales Rep</th>
            <th className="px-4 py-2 text-left">Converted Leads</th>
          </tr>
        </thead>
        <tbody>
          {data.map(rep => (
            <tr key={rep.repId} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{rep.repName}</td>
              <td className="px-4 py-2 font-bold">{rep.convertedLeads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const activityTypeColors = {
  Call: '#3B82F6',
  Email: '#10B981',
  WhatsApp: '#8B5CF6',
  Meeting: '#F59E0B',
};

const ActivityAnalysis = ({ isAdmin, user }) => {
  const [data, setData] = useState([]); // array of { rep: string, Call: n, Email: n, ... }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    api.get('/api/reports/activity-metrics')
      .then(res => {
        const raw = res.data.data || res.data;
        // Transform: { repName: {Call: n, ...}, ... } => [{ rep: repName, Call, Email, ... }]
        const arr = Object.entries(raw).map(([rep, acts]) => ({ rep, ...acts }));
        setData(arr);
      })
      .catch(() => setError('Failed to load activity metrics'))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="h-64 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500 py-6 text-center">{error}</div>;
  if (!data.length) return <div className="text-gray-500 py-6 text-center">No activity data available.</div>;

  // For reps, only show their own data
  const chartData = isAdmin ? data : data.filter(d => d.rep === user.name);
  const activityTypes = ['Call', 'Email', 'WhatsApp', 'Meeting'];
  // Chart config for legend
  const config = Object.fromEntries(activityTypes.map(type => [type, { label: type, color: activityTypeColors[type] }]));

  return (
    <ChartContainer config={config} className="bg-white rounded-lg p-4">
      <ReBarChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rep" />
        <YAxis allowDecimals={false} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        {activityTypes.map(type => (
          <Bar
            key={type}
            dataKey={type}
            fill={activityTypeColors[type]}
            name={type}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        ))}
      </ReBarChart>
    </ChartContainer>
  );
};

const ReportsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('conversion');
  const isAdmin = user?.role === 'admin';

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? 'Team performance and insights'
            : 'Your performance and insights'}
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="conversion">Conversion Metrics</TabsTrigger>
          <TabsTrigger value="activities">Activity Analysis</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="conversion" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Lead progression through sales stages</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex flex-col items-center justify-center">
              {isAdmin ? <ConversionFunnelChart /> : <p className="text-muted-foreground">Conversion funnel is available for admins only.</p>}
            </CardContent>
          </Card>
          {isAdmin && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Converted Leads by Rep</CardTitle>
                <CardDescription>Sales rep performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ConvertedLeadsByRep />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="activities" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Analysis</CardTitle>
              <CardDescription>Effectiveness of different interaction types</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <ActivityAnalysis isAdmin={isAdmin} user={user} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-insights" className="py-4 space-y-6">
          <WinLossReportPanel />
          {isAdmin && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Additional AI Insights</CardTitle>
                <CardDescription>More AI-powered insights will be available soon</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <p className="text-muted-foreground">More AI insights coming in future updates</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;





