import { Progress } from "@/components/ui/progress";

const pipelineStages = [
  {
    stage: "Qualification",
    value: 5,
    total: 12,
    color: "bg-blue-500",
  },
  {
    stage: "Meeting Scheduled",
    value: 3,
    total: 12,
    color: "bg-purple-500",
  },
  {
    stage: "Proposal Sent",
    value: 2,
    total: 12,
    color: "bg-yellow-500",
  },
  {
    stage: "Negotiation",
    value: 1,
    total: 12,
    color: "bg-orange-500",
  },
  {
    stage: "Closed Won",
    value: 1,
    total: 12,
    color: "bg-green-500",
  },
];

export function PipelineSummary() {
  return (
    <div className="space-y-4">
      {pipelineStages.map((stage) => (
        <div key={stage.stage} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{stage.stage}</span>
            <span className="text-sm text-muted-foreground">
              {stage.value} of {stage.total}
            </span>
          </div>
          <Progress
            value={(stage.value / stage.total) * 100}
            className={stage.color}
          />
        </div>
      ))}
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-sm font-medium">Total Pipeline Value</span>
        <span className="text-sm font-medium">$450,000</span>
      </div>
    </div>
  );
} 