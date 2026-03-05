import { useEffect, useState, useMemo } from "react";
import API from "../api";
import "../styles/alerts.css";
import { jwtDecode } from "jwt-decode";
 
const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const user = useMemo(() => {
      if (!token) return null;
      try {
        return jwtDecode(token);
      } catch {
        return null;
      }
    }, [token]);
  const fetchAlerts = async () => {
    try {
      const res = await API.get("/alerts");
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchAlerts(); // initial fetch

  const interval = setInterval(() => {
    fetchAlerts();
  }, 30000); // 30 seconds

  return () => clearInterval(interval); // cleanup on unmount
}, []);

  const handleResolve = async (id) => {
    try {
      await API.put(`/alerts/${id}/resolve`);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

    if (loading) return (
  <div className="loading-container">
  <div className="loading-spinner"></div>
  <p className="loading-text">Loading alerts...</p>
  </div>
  
);

  // KPI calculations
  const highCount = alerts.filter(a => a.severity === "high").length;
  const mediumCount = alerts.filter(a => a.severity === "medium").length;
  const lowCount = alerts.filter(a => a.severity === "low").length;

  // Group by type
  const groupedAlerts = {
    ICU_CAPACITY: alerts.filter(a => a.type === "ICU_CAPACITY"),
    STAFF_SHORTAGE: alerts.filter(a => a.type === "STAFF_SHORTAGE"),
    OXYGEN_LOW: alerts.filter(a => a.type === "OXYGEN_LOW"),
    INFLOW_SURGE: alerts.filter(a => a.type === "INFLOW_SURGE"),
  };

  return (
    <div className="alerts-page">

      {/* KPI ROW */}
      <div className="alerts-kpi-row">
        <div className="alert-kpi high">
          <h3>{highCount}</h3>
          <p>High Severity</p>
        </div>
        <div className="alert-kpi medium">
          <h3>{mediumCount}</h3>
          <p>Medium Severity</p>
        </div>
        <div className="alert-kpi low">
          <h3>{lowCount}</h3>
          <p>Low Severity</p>
        </div>
        <div className="alert-kpi total">
          <h3>{alerts.length}</h3>
          <p>Total Active Alerts</p>
        </div>
      </div>

      {/* 2x2 GRID */}
      <div className="alerts-grid">
        {Object.entries(groupedAlerts).map(([type, items]) => (
          <div key={type} className="alerts-category-card">
            <div className="category-header">
              <h4>{type.replace("_", " ")}</h4>
              <span className="category-count">{items.length}</span>
            </div>

            <div className="category-alert-list">
              {items.length === 0 ? (
                <p className="no-alerts">No active alerts</p>
              ) : (
                items.map(alert => (
                  <div key={alert._id} className={`alert-entry ${alert.severity}`}>
                    <div className="alert-info">
                      <p className="alert-message">{alert.message}</p>
                      <span className="alert-time">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {user?.role?.toLowerCase() === "admin" && (
                      <button
                      className="resolve-btn"
                      onClick={() => handleResolve(alert._id)}
                    >
                      Resolve
                    </button>
                    )}
                     
                  </div> 
                ))
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AlertsPage;