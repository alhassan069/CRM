import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react";

// Temporary mock data - will be replaced with Redux state
const mockData = {
  pipelineValue: 1250000,
  totalDeals: 45,
  winRate: 68,
  averageDealSize: 25000,
  dealsByStage: [
    { stage: "Qualification", count: 15, value: 300000 },
    { stage: "Meeting Scheduled", count: 12, value: 240000 },
    { stage: "Proposal Sent", count: 8, value: 160000 },
    { stage: "Negotiation", count: 6, value: 120000 },
    { stage: "Closed Won", count: 4, value: 80000 },
  ],
  dealsByMonth: [
    { month: "Jan", value: 150000 },
    { month: "Feb", value: 180000 },
    { month: "Mar", value: 220000 },
    { month: "Apr", value: 190000 },
    { month: "May", value: 250000 },
    { month: "Jun", value: 260000 },
  ],
  topPerformingContacts: [
    { name: "John Doe", deals: 8, value: 200000 },
    { name: "Jane Smith", deals: 6, value: 150000 },
    { name: "Mike Johnson", deals: 5, value: 125000 },
  ],
};

export default function Reports() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7days">Last 7 Days</SelectItem>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="last90days">Last 90 Days</SelectItem>
            <SelectItem value="thisYear">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pipeline Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockData.pipelineValue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.totalDeals}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.winRate}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Deal Size
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockData.averageDealSize.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Deals by Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.dealsByStage.map((stage) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <span className="text-sm text-muted-foreground">
                          {stage.count} deals
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${(stage.value / mockData.pipelineValue) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${stage.value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.topPerformingContacts.map((contact) => (
                    <div
                      key={contact.name}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.deals} deals
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${contact.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.dealsByStage.map((stage) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <span className="text-sm text-muted-foreground">
                        {stage.count} deals
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${(stage.value / mockData.pipelineValue) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${stage.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.dealsByMonth.map((month) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${
                            (month.value / Math.max(...mockData.dealsByMonth.map((m) => m.value))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${month.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 