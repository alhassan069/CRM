import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, DollarSign, Calendar, Building, User } from "lucide-react";

// Temporary mock data - will be replaced with Redux state
const dealData = {
  id: 1,
  name: "Enterprise Software Deal",
  value: 50000,
  stage: "Qualification",
  probability: 20,
  expectedCloseDate: "2024-06-30",
  organization: "Tech Corp",
  contact: "John Doe",
  dealCoach: {
    recommendations: [
      {
        id: 1,
        text: "Schedule a technical demo with the engineering team",
        priority: "high",
        rationale: "Based on contact's technical background",
      },
      {
        id: 2,
        text: "Prepare ROI analysis",
        priority: "medium",
        rationale: "Decision makers are focused on cost savings",
      },
    ],
  },
  objections: [
    {
      id: 1,
      text: "The price is too high for our budget",
      response: "Let me show you our ROI calculator and how we've helped similar companies save costs",
      status: "addressed",
    },
    {
      id: 2,
      text: "We're concerned about implementation time",
      response: "We can provide a detailed implementation timeline and assign a dedicated project manager",
      status: "pending",
    },
  ],
  activities: [
    {
      id: 1,
      type: "meeting",
      subject: "Initial Discovery Call",
      date: "2024-03-15",
      status: "completed",
    },
    {
      id: 2,
      type: "email",
      subject: "Proposal Sent",
      date: "2024-03-20",
      status: "completed",
    },
  ],
};

export default function DealDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{dealData.name}</h2>
          <div className="mt-2 flex items-center space-x-4">
            <Badge variant="outline">{dealData.stage}</Badge>
            <span className="text-sm text-muted-foreground">
              Probability: {dealData.probability}%
            </span>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" /> Edit Deal
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deal-coach">Deal Coach</TabsTrigger>
          <TabsTrigger value="objections">Objections</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Deal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${dealData.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Expected Close: {dealData.expectedCloseDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{dealData.organization}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{dealData.contact}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pipeline Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={dealData.probability} className="h-2" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Current stage: {dealData.stage}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deal-coach">
          <Card>
            <CardHeader>
              <CardTitle>AI Deal Coach Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dealData.dealCoach.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{rec.text}</h3>
                    <Badge
                      variant={rec.priority === "high" ? "destructive" : "default"}
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {rec.rationale}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objections">
          <Card>
            <CardHeader>
              <CardTitle>Objection Handler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dealData.objections.map((obj) => (
                <div
                  key={obj.id}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Objection</h3>
                      <Badge
                        variant={
                          obj.status === "addressed" ? "default" : "secondary"
                        }
                      >
                        {obj.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{obj.text}</p>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Suggested Response</h4>
                      <p className="text-sm text-muted-foreground">
                        {obj.response}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dealData.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{activity.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.date}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 