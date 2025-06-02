import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Temporary mock data - will be replaced with Redux state
const organizations = [
  { id: 1, name: "Tech Corp" },
  { id: 2, name: "Startup Inc" },
  { id: 3, name: "Enterprise Solutions" },
];

const contacts = [
  { id: 1, name: "John Doe", organizationId: 1 },
  { id: 2, name: "Jane Smith", organizationId: 2 },
  { id: 3, name: "Mike Johnson", organizationId: 3 },
];

const stages = [
  { id: "qualification", name: "Qualification", probability: 20 },
  { id: "meeting", name: "Meeting Scheduled", probability: 40 },
  { id: "proposal", name: "Proposal Sent", probability: 60 },
  { id: "negotiation", name: "Negotiation", probability: 80 },
  { id: "closed_won", name: "Closed Won", probability: 100 },
];

export default function DealForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    value: "",
    stage: "",
    probability: "",
    expectedCloseDate: "",
    organizationId: "",
    contactId: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement form submission with Redux
    console.log("Form submitted:", formData);
    navigate("/deals");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStageChange = (value) => {
    const stage = stages.find((s) => s.id === value);
    setFormData((prev) => ({
      ...prev,
      stage: value,
      probability: stage.probability,
    }));
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Deal" : "New Deal"}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Deal Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="value">Deal Value</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  value={formData.value}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                <Input
                  id="expectedCloseDate"
                  name="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={handleStageChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  name="probability"
                  type="number"
                  value={formData.probability}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="organizationId">Organization</Label>
                <Select
                  value={formData.organizationId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, organizationId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactId">Contact</Label>
                <Select
                  value={formData.contactId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, contactId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts
                      .filter(
                        (contact) =>
                          !formData.organizationId ||
                          contact.organizationId.toString() ===
                            formData.organizationId
                      )
                      .map((contact) => (
                        <SelectItem
                          key={contact.id}
                          value={contact.id.toString()}
                        >
                          {contact.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/deals")}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Deal" : "Create Deal"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
} 