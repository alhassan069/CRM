import { Card } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";

export function Overview() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [30000, 35000, 32000, 38000, 40000, 45231],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        label: "Deals",
        data: [8, 10, 9, 11, 12, 12],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="p-4">
      <Chart type="line" data={data} options={options} />
    </Card>
  );
} 