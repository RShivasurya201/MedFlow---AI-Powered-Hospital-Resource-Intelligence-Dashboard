import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SeverityPie = ({ severityDistribution }) => {
  const data = {
    labels: ["Mild", "Moderate", "Severe"],
    datasets: [
      {
        data: [
          severityDistribution.mild || 0,
          severityDistribution.moderate || 0,
          severityDistribution.severe || 0
        ],
        backgroundColor: [
          "#90e4c1",
          "#ffbb00",
          "#ff4444"
        ],
        borderWidth: 0
      }
    ]
  };

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: {
      display: false   // 🔥 turn it off
    }
  }
};

  return (
    <div className="analytics-card">
  <h3>Severity Distribution</h3>

  <div className="donut-layout">
    <div className="donut-wrapper">
      <Doughnut data={data} options={options} />
    </div>

    <div className="custom-legend">
      <div className="legend-item">
        <span className="legend-color mild"></span>
        Mild ({severityDistribution.mild})
      </div>
      <div className="legend-item">
        <span className="legend-color moderate"></span>
        Moderate ({severityDistribution.moderate})
      </div>
      <div className="legend-item">
        <span className="legend-color severe"></span>
        Severe ({severityDistribution.severe})
      </div>
    </div>
  </div>
</div>
  );
};

export default SeverityPie;