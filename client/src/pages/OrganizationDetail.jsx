import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit, Globe, Building, Users, DollarSign } from "lucide-react";

// Temporary mock data - will be replaced with Redux state
const organizationData = {
  id: 1,
  name: "Tech Corp",
  industry: "Technology",
  website: "www.techcorp.com",
  contacts: [
    {
      id: 1,
      name: "John Doe",
      title: "CTO",
      email: "john.doe@techcorp.com",
      phone: "+1 234-567-8901",
    },
    {
      id: 2,
      name: "Jane Smith",
      title: "CEO",
      email: "jane.smith@techcorp.com",
      phone: "+1 234-567-8902",
    },
  ],
  deals: [
    {
      id: 1,
      name: "Enterprise Software Deal",
      value: 50000,
      stage: "Qualification",
      probability: 20,
    },
    {
      id: 2,
      name: "Cloud Migration Project",
      value: 75000,
      stage: "Meeting Scheduled",
      probability: 40,
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

export default function OrganizationDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {organizationData.name}
          </h2>
          <div className="mt-2 flex items-center space-x-4">
            <Badge variant="outline">{organizationData.industry}</Badge>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" /> Edit Organization
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://${organizationData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {organizationData.website}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{organizationData.industry}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Total Contacts</span>
                  </div>
                  <span className="font-medium">
                    {organizationData.contacts.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Active Deals</span>
                  </div>
                  <span className="font-medium">
                    {organizationData.deals.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organizationData.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.email}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <CardTitle>Deals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organizationData.deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{deal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stage: {deal.stage}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Probability: {deal.probability}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${deal.value.toLocaleString()}
                    </p>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
              {organizationData.activities.map((activity) => (
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