import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

const SeverityAreaChart = ({ severityTrend }) => {
  const data = {
    labels: severityTrend.map(item => item.hour),
    datasets: [
      {
        label: "Avg Severity Score",
        data: severityTrend.map(item => item.avgSeverity),
        fill: true,
        backgroundColor: "rgba(1,78,86,0.2)",
        borderColor: "#014e56",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="analytics-card">
      <h3>Severity Trend (Last 6 Hours)</h3>
      <Line data={data} />
    </div>
  );
};

export default SeverityAreaChart;