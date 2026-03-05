import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

const formatTime = (iso) => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div style={{
      background: "white",
      padding: "10px 14px",
      border: "1px solid #ddd",
      borderRadius: "8px"
    }}>
      <div style={{ fontSize: "0.85rem", marginBottom: 6 }}>
        {formatTime(label)}
      </div>
      {payload.map((entry, index) => (
        <div key={index} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
};

const VitalsChart = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px 0",
        color: "#777"
      }}>
        No vitals history available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={history}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

        <XAxis
          dataKey="recordedAt"
          tickFormatter={formatTime}
          tick={{ fontSize: 12 }}
        />

        {/* LEFT AXIS — Severity (0–10) */}
        <YAxis
          yAxisId="left"
          domain={[0, 10]}
          tick={{ fontSize: 12 }}
        />

        {/* RIGHT AXIS — Oxygen (70–100 typical range) */}
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[70, 100]}
          tick={{ fontSize: 12 }}
        />

        <Tooltip content={<CustomTooltip />} />
        <Legend />

        <Line
          yAxisId="left"
          type="monotone"
          dataKey="severityScore"
          stroke="#014e56"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Severity"
        />

        <Line
          yAxisId="right"
          type="monotone"
          dataKey="oxygenLevel"
          stroke="#23408E"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Oxygen"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VitalsChart;