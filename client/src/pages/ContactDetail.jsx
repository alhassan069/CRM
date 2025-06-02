import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Phone, Building, Calendar } from "lucide-react";

// Temporary mock data - will be replaced with Redux state
const contactData = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 234-567-8901",
  organization: "Tech Corp",
  title: "CTO",
  persona: {
    communicationPreferences: "Prefers email communication",
    painPoints: "Looking for scalable solutions",
    personalitySummary: "Technical decision maker, detail-oriented",
    salesApproachTips: "Focus on technical specifications and ROI",
  },
  activities: [
    {
      id: 1,
      type: "email",
      subject: "Product Demo Request",
      date: "2024-03-15",
      status: "completed",
    },
    {
      id: 2,
      type: "call",
      subject: "Follow-up Discussion",
      date: "2024-03-20",
      status: "scheduled",
    },
  ],
  deals: [
    {
      id: 1,
      name: "Enterprise Software Deal",
      value: 50000,
      stage: "Negotiation",
      probability: 75,
    },
  ],
};

export default function ContactDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`/avatars/${contactData.id}.png`} />
            <AvatarFallback>
              {contactData.firstName[0]}
              {contactData.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {contactData.firstName} {contactData.lastName}
            </h2>
            <p className="text-muted-foreground">{contactData.title}</p>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" /> Edit Contact
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="persona">AI Persona</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{contactData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contactData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{contactData.organization}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactData.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{activity.subject}</span>
                    </div>
                    <Badge
                      variant={activity.status === "completed" ? "default" : "secondary"}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Activity list component will go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <CardTitle>Associated Deals</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Deals list component will go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="persona">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Persona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Communication Preferences</h3>
                <p className="text-muted-foreground">
                  {contactData.persona.communicationPreferences}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Pain Points</h3>
                <p className="text-muted-foreground">
                  {contactData.persona.painPoints}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Personality Summary</h3>
                <p className="text-muted-foreground">
                  {contactData.persona.personalitySummary}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Sales Approach Tips</h3>
                <p className="text-muted-foreground">
                  {contactData.persona.salesApproachTips}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 