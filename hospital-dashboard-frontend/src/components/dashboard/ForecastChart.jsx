import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import { Line } from "react-chartjs-2";
import "../../styles/dashboard.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ForecastChart = ({ forecast }) => {
  if (!forecast || !forecast.length) return null;

  const data = {
    labels: forecast.map((_, i) => `+${i + 1} hr`),
    datasets: [
      {
        label: "Predicted Inflow",
        data: forecast,
        borderColor: "#014e56",
        backgroundColor: "#90e4c1",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="analytics-card">
      <h3>Inflow Forecast</h3>
      <Line data={data} />
    </div>
  );
};

export default ForecastChart;
