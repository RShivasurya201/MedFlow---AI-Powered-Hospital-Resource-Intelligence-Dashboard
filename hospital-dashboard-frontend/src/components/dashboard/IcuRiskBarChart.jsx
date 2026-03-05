import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const IcuRiskBarChart = ({ icuRiskBuckets }) => {
  const data = {
    labels: ["Low (0–0.3)", "Medium (0.3–0.7)", "High (0.7–1)"],
    datasets: [
      {
        label: "Patients",
        data: [
          icuRiskBuckets.low || 0,
          icuRiskBuckets.medium || 0,
          icuRiskBuckets.high || 0
        ],
        backgroundColor: [
          "#90e4c1",
          "#ffbb00",
          "#ff4444"
        ]
      }
    ]
  };

  const options = {
    indexAxis: "y",   // 🔥 makes it horizontal
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="analytics-card">
      <h3>ICU Risk Overview</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default IcuRiskBarChart;