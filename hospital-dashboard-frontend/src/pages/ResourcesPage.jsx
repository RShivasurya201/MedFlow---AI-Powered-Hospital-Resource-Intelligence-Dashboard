import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api";
import { useToast } from "../context/ToastContext";
import "../styles/resources.css";

const ResourcesPage = () => {
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [token]);

  const { showToast } = useToast();

  const [capacity, setCapacity] = useState(null);
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    try {
      const [capacityRes, resourceRes] = await Promise.all([
        API.get("/resources/capacity"),
        API.get("/resources")
      ]);

      setCapacity(capacityRes.data);

      // Convert numbers to strings for controlled inputs
      const data = resourceRes.data;
      setResources({
        totalBeds: data.totalBeds?.toString() || "",
        icuBedsTotal: data.icuBedsTotal?.toString() || "",
        icuBedsOccupied: data.icuBedsOccupied?.toString() || "",
        generalBedsOccupied: data.generalBedsOccupied?.toString() || "",
        oxygenLevel: data.oxygenLevel?.toString() || "",
        staffAvailable: data.staffAvailable?.toString() || ""
      });

    } catch (err) {
      console.error(err);
      showToast("Failed to load resources", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
  <div className="loading-container">
  <div className="loading-spinner"></div>
  <p className="loading-text">Loading resources...</p>
  </div>
  
);
  
  if (!capacity || !resources) return <p>No data available</p>;

  // ---------------- UTIL HELPERS ----------------
  const getUtilizationColor = (percentage) => {
    if (percentage > 85) return "#e53935";
    if (percentage > 70) return "#ff9800";
    return "#014e56";
  };

  const icuPercent =
    capacity.icu.total > 0
      ? (capacity.icu.occupied / capacity.icu.total) * 100
      : 0;

  const generalPercent =
    capacity.general.total > 0
      ? (capacity.general.occupied / capacity.general.total) * 100
      : 0;

  // ---------------- FORM SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      totalBeds: Number(resources.totalBeds),
      icuBedsTotal: Number(resources.icuBedsTotal),
      icuBedsOccupied: Number(resources.icuBedsOccupied),
      generalBedsOccupied: Number(resources.generalBedsOccupied),
      oxygenLevel: Number(resources.oxygenLevel),
      staffAvailable: Number(resources.staffAvailable)
    };

    try {
      await API.post("/resources/set", formattedData);
      showToast({
  message: "Resources updated successfully",
  type: "success"
});
      fetchData();
    } catch (err) {
      showToast({
  message: err.response?.data?.message || "Update failed",
  type: "error"
});
    }
  };

  return (
    <div className="resources-page">

      {/* SECTION A — Capacity Overview */}
      <div className="resources-grid">

        <div className="resource-card">
          <h3>ICU Capacity</h3>

          <div className="progress-wrapper">
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[{ value: icuPercent }]}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={getUtilizationColor(icuPercent)}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="progress-label">
              {icuPercent.toFixed(0)}%
            </div>
          </div>

          <p>Occupied: {capacity.icu.occupied}</p>
          <p>Available: {capacity.icu.available}</p>
        </div>

        <div className="resource-card">
          <h3>General Ward Capacity</h3>

          <div className="progress-wrapper">
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[{ value: generalPercent }]}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={getUtilizationColor(generalPercent)}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="progress-label">
              {generalPercent.toFixed(0)}%
            </div>
          </div>

          <p>Occupied: {capacity.general.occupied}</p>
          <p>Available: {capacity.general.available}</p>
        </div>

      </div>

      {/* SECTION B — Operational Indicators */}
      <div className="resources-grid">

        <div className="resource-card">
          <h3>Oxygen Level</h3>

          <div className="oxygen-bar-container">
            <div
              className="oxygen-bar"
              style={{
                width: `${capacity.oxygenLevel}%`,
                background:
                  capacity.oxygenLevel < 40
                    ? "#e53935"
                    : "#014e56"
              }}
            />
          </div>

          <h2>{capacity.oxygenLevel}%</h2>
        </div>

        <div className="resource-card">
          <h3>Staff Available</h3>
          <h2>{capacity.staffAvailable}</h2>
        </div>

      </div>

      {/* SECTION C — ADMIN CONFIG */}
      {user?.role?.toLowerCase() === "admin" && (
        <div className="resource-config">
          <h3>Update Resource Configuration</h3>

          <form onSubmit={handleSubmit} className="resource-form">

            <div className="form-group">
              <label>Total Beds</label>
              <input
                type="number"
                value={resources.totalBeds}
                onChange={(e) =>
                  setResources({
                    ...resources,
                    totalBeds: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>ICU Total Beds</label>
              <input
                type="number"
                value={resources.icuBedsTotal}
                onChange={(e) =>
                  setResources({
                    ...resources,
                    icuBedsTotal: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>ICU Occupied</label>
              <input
                type="number"
                value={resources.icuBedsOccupied}
                onChange={(e) =>
                  setResources({
                    ...resources,
                    icuBedsOccupied: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>General Ward Occupied</label>
              <input
                type="number"
                value={resources.generalBedsOccupied}
                onChange={(e) =>
                  setResources({
                    ...resources,
                    generalBedsOccupied: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Oxygen Level (%)</label>
              <input
                type="number"
                value={resources.oxygenLevel}
                onChange={(e) =>
                  setResources({
                    ...resources,
                    oxygenLevel: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Staff Available</label>
              <input
                type="number"
                value={resources.staffAvailable}
                onChange={(e) =>
                  setResources({
                    ...resources,
                    staffAvailable: e.target.value
                  })
                }
                required
              />
            </div>

            <button type="submit">Save Changes</button>

          </form>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;