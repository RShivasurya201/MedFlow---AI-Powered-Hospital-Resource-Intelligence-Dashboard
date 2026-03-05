import { useEffect, useState } from "react";
import { FaUsers, FaBed, FaHospital, FaChartLine } from "react-icons/fa";
import API from "../api";
import StatCard from "../components/dashboard/StatsCard";
import ForecastChart from "../components/dashboard/ForecastChart";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import SeverityPie from "../components/dashboard/SeverityPie";
import IcuRiskBarChart from "../components/dashboard/IcuRiskBarChart";
import SeverityAreaChart from "../components/dashboard/SeverityAreaChart";
import "../styles/dashboard.css";
import { LuBed } from "react-icons/lu";

const DashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/dashboard");
        console.log("DASHBOARD DATA:", res.data);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="loading-container">
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading dashboard data...</p>
      </div>
      </div>
    );
  }

  const resources = data.resources || {};
  const patientStats = data.patientStats || {};
  const latestPrediction = data.latestPrediction || {};
  const alerts = data.alerts || [];

  const icuBedsTotal = resources.icuBedsTotal || 0;
  const icuBedsOccupied = resources.icuBedsOccupied || 0;
  const totalBeds = resources.totalBeds || 0;
  const occupiedBeds =
    (resources.icuBedsOccupied || 0) + (resources.generalBedsOccupied || 0);
  const availableBeds = totalBeds - occupiedBeds;
  const icuPercentage =
    icuBedsTotal > 0 ? Math.round((icuBedsOccupied / icuBedsTotal) * 100) : 0;
  const bedUtilizationPercentage =
    totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const forecastArray = latestPrediction?.forecast || [];
  const forecastPeak =
    forecastArray.length > 0 ? Math.max(...forecastArray) : null;
  const forecastPeakDisplay =
    forecastPeak !== null && forecastPeak !== undefined
      ? forecastPeak.toFixed(2)
      : "-";
  const severityDistribution = data.severityDistribution || {};
  const icuRiskBuckets = data.icuRiskBuckets || {};
  const severityTrend = data.severityTrend || [];
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard
          title="Total Patients"
          value={patientStats.totalPatients || 0}
          icon={<FaUsers />}
        />
        <StatCard
          title="ICU Occupied"
          value={icuBedsOccupied}
          total={icuBedsTotal}
          percentage={icuPercentage}
          icon={<FaBed />}
          circularProgress={true}
        />
        <StatCard
          title="Available Beds"
          value={availableBeds}
          total={totalBeds}
          percentage={100 - bedUtilizationPercentage}
          icon={<LuBed />}
          circularProgress={true}
          higherIsBetter={true}
        />
        <StatCard
          title="Forecast Peak"
          value={forecastPeakDisplay}
          icon={<FaChartLine />}
        />
      </div>

      <AlertsPanel alerts={alerts} />

<div className="analytics-section">

  {/* Row 1 */}
  <div className="analytics-row">
    <IcuRiskBarChart icuRiskBuckets={icuRiskBuckets} />
    <SeverityPie severityDistribution={severityDistribution} />
  </div>

  {/* Row 2 */}
  <div className="analytics-row">
    <ForecastChart forecast={latestPrediction?.forecast || []} />
    <SeverityAreaChart severityTrend={severityTrend} />
  </div>

</div>
    </div>
  );
};

export default DashboardPage;