import "../../styles/dashboard.css";

const StatCard = ({ title, value, percentage, total, icon, circularProgress = false, higherIsBetter = false }) => {
  const percentageValue = percentage !== undefined 
    ? percentage 
    : (total && total > 0 ? Math.round((value / total) * 100) : 0);

  // Determine color based on percentage level
  // For ICU Occupied: higher is worse (red), for Available Beds: higher is better (green)
  const getProgressColor = (percent, higherIsBetter) => {
    if (higherIsBetter) {
      // For Available Beds - higher percentage is better
      if (percent >= 60) return "#90e4c1"; // Green for high availability (60%+)
      if (percent >= 40) return "#ffbb00"; // Yellow for medium (40-59%)
      if (percent >= 20) return "#ff8800"; // Orange for low (20-39%)
      return "#ff4444"; // Red for very low (0-19%)
    } else {
      // For ICU Occupied - higher percentage is worse
      if (percent >= 80) return "#ff4444"; // Red for high (80%+)
      if (percent >= 60) return "#ff8800"; // Orange for medium-high (60-79%)
      if (percent >= 40) return "#ffbb00"; // Yellow for medium (40-59%)
      return "#90e4c1"; // Green for low (0-39%)
    }
  };

  const progressColor = getProgressColor(percentageValue, higherIsBetter);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (percentageValue / 100) * circumference;

 return (
  <div className="stat-card">
    <div className="stat-card-header">
      {icon && <span className="stat-card-icon">{icon}</span>}
      <h4>{title}</h4>
    </div>

    <div className="stat-card-content-centered">

      {circularProgress && (percentage !== undefined || (total && total > 0)) ? (
        <>
          <div className="stat-card-circular-progress">
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={progressColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>

            {/* BIG NUMBER INSIDE CIRCLE */}
            <div className="circular-progress-value">
              {percentageValue}%
            </div>
          </div>

          {/* PERCENTAGE BELOW */}
          <div className="circular-progress-subtext">
            {value} {higherIsBetter ? "available" : "occupied"}
          </div>
        </>
      ) : (
        <div className="stat-big-number">
          {value}
        </div>
      )}

    </div>
  </div>
);
};

export default StatCard;
