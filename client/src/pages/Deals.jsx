import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Temporary mock data - will be replaced with Redux state
const pipelineStages = [
  {
    id: "qualification",
    title: "Qualification",
    deals: [
      {
        id: 1,
        name: "Enterprise Software Deal",
        value: 50000,
        organization: "Tech Corp",
        contact: "John Doe",
        probability: 20,
      },
      {
        id: 2,
        name: "Cloud Migration Project",
        value: 75000,
        organization: "Startup Inc",
        contact: "Jane Smith",
        probability: 30,
      },
    ],
  },
  {
    id: "meeting",
    title: "Meeting Scheduled",
    deals: [
      {
        id: 3,
        name: "Security Solution",
        value: 45000,
        organization: "Enterprise Solutions",
        contact: "Mike Johnson",
        probability: 50,
      },
    ],
  },
  {
    id: "proposal",
    title: "Proposal Sent",
    deals: [
      {
        id: 4,
        name: "Data Analytics Platform",
        value: 60000,
        organization: "Data Corp",
        contact: "Sarah Wilson",
        probability: 70,
      },
    ],
  },
  {
    id: "negotiation",
    title: "Negotiation",
    deals: [
      {
        id: 5,
        name: "AI Integration Project",
        value: 90000,
        organization: "AI Solutions",
        contact: "Alex Brown",
        probability: 80,
      },
    ],
  },
];

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState("");

  const onDragEnd = (result) => {
    // TODO: Implement drag and drop logic with Redux
    console.log("Drag end:", result);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Deals Pipeline</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Deal
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pipelineStages.map((stage) => (
            <Card key={stage.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{stage.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <Droppable droppableId={stage.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {stage.deals.map((deal, index) => (
                        <Draggable
                          key={deal.id}
                          draggableId={deal.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="rounded-lg border bg-card p-4 shadow-sm"
                            >
                              <div className="space-y-2">
                                <h3 className="font-medium">{deal.name}</h3>
                                <div className="text-sm text-muted-foreground">
                                  <p>{deal.organization}</p>
                                  <p>{deal.contact}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    ${deal.value.toLocaleString()}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {deal.probability}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
} 