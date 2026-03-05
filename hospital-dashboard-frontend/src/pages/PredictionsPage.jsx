import { useEffect, useState, useMemo } from "react";
import API from "../api";
import ForecastChart from "../components/dashboard/ForecastChart";
import { jwtDecode } from "jwt-decode";
import "../styles/predictions.css";

const PredictionsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
    const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [token]);

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const fetchPredictions = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await API.get("/predictions");
      setPredictions(res.data || []);
      setSelectedIndex(0);
    } catch (err) {
      console.error(err);
      setError("Failed to load predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleGeneratePrediction = async () => {
    try {
      setGenerating(true);
      setError(null);
      await API.post("/predictions/generate");
      await fetchPredictions();
    } catch (err) {
      console.error(err);
      setError("Failed to generate new prediction.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="prediction-loading">
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading predictions...</p>
      </div>
      </div>
    );
  }

  const hasPredictions = predictions && predictions.length > 0;
  const selectedPrediction = hasPredictions ? predictions[selectedIndex] : null;
  const forecast = selectedPrediction?.forecast || [];

  const peak =
    forecast.length > 0 ? Math.max(...forecast).toFixed(2) : "-";
  const average =
    forecast.length > 0
      ? (forecast.reduce((sum, v) => sum + v, 0) / forecast.length).toFixed(2)
      : "-";

  return (
    <div className="predictions-page">
      <div className="predictions-header">
        <div>
          <h2>Inflow Predictions</h2>
          <p>Review recent patient inflow forecasts and run new simulations.</p>
        </div>
        { isAdmin && (
        <button
          className="primary-button"
          onClick={handleGeneratePrediction}
          disabled={generating}
        >
          {generating ? "Generating..." : "Run New Prediction"}
        </button>)}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!hasPredictions ? (
        <div className="empty-state-card">
          <h3>No predictions yet</h3>
          <p>Run your first prediction to see inflow forecasts.</p>
          <button
            className="primary-button"
            onClick={handleGeneratePrediction}
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate Prediction"}
          </button>
        </div>
      ) : (
        <div className="predictions-layout">
          <div className="predictions-main">
            <ForecastChart forecast={forecast} />

            <div className="prediction-stats-card">
              <h3>Forecast Summary</h3>
              <div className="prediction-stats-grid">
                <div className="prediction-stat-item">
                  <span className="label">Peak Inflow</span>
                  <span className="value">{peak}</span>
                </div>
                <div className="prediction-stat-item">
                  <span className="label">Average Inflow</span>
                  <span className="value">{average}</span>
                </div>
                <div className="prediction-stat-item">
                  <span className="label">Horizon</span>
                  <span className="value">
                    {forecast.length} hours
                  </span>
                </div>
                <div className="prediction-stat-item">
                  <span className="label">Generated At</span>
                  <span className="value small">
                    {new Date(
                      selectedPrediction.generatedAt
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="predictions-history-card">
            <div className="predictions-history-header">
              <h3>Recent Runs</h3>
              <span className="history-count-badge">
                {predictions.length}
              </span>
            </div>
            <div className="predictions-history-list">
              {predictions.map((p, index) => {
                const peakValue =
                  p.forecast && p.forecast.length
                    ? Math.max(...p.forecast).toFixed(1)
                    : "-";
                const isActive = index === selectedIndex;

                return (
                  <button
                    key={p._id || index}
                    className={`prediction-history-item ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <div className="history-main">
                      <span className="history-title">
                        Run {predictions.length - index}
                      </span>
                      <span className="history-subtitle">
                        Peak: {peakValue}
                      </span>
                    </div>
                    <span className="history-date">
                      {new Date(p.generatedAt).toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionsPage;