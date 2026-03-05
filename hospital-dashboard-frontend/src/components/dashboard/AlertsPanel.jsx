import { FaBed, FaUserMd, FaFlask, FaChartLine } from "react-icons/fa";
import "../../styles/dashboard.css";

const getAlertIcon = (type) => {
  switch (type) {
    case "ICU_CAPACITY":
      return <FaBed />;
    case "STAFF_SHORTAGE":
      return <FaUserMd />;
    case "OXYGEN_LOW":
      return <FaFlask />;
    case "INFLOW_SURGE":
      return <FaChartLine />;
    default:
      return <FaBed />;
  }
};

const formatAlertType = (type) => {
  return type
    .split("_")
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const AlertsPanel = ({ alerts }) => {
  if (!alerts || !alerts.length) {
    return (
      <div className="alerts-card">
        <div className="alerts-header">
          <h3>Active Alerts</h3>
          <span className="alert-count-badge zero">0</span>
        </div>
        <div className="no-alerts">
          <p>No active alerts</p>
          <span className="no-alerts-icon">✓</span>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-card">
      <div className="alerts-header">
        <h3>Active Alerts</h3>
        <span className="alert-count-badge">{alerts.length}</span>
      </div>
      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="alert-item"
          >
            <div className={`alert-icon-wrapper ${alert.severity}`}>
              <div className="alert-icon">
                {getAlertIcon(alert.type)}
              </div>
            </div>
            <div className="alert-content">
              <div className="alert-header">
                <strong>{formatAlertType(alert.type)}</strong>
                <span className={`alert-severity-badge ${alert.severity}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
              <p>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
