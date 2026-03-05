const generateMockInflow = () => {
  const hours = 24 * 7; // 1 week of hourly data
  const inflow = [];

  for (let t = 0; t < hours; t++) {
    const dailyPattern = 15 * Math.sin((2 * Math.PI * t) / 24);
    const weeklyPattern = 8 * Math.sin((2 * Math.PI * t) / 168);
    const trend = 0.05 * t;
    const base = 50;
    const noise = Math.random() * 6 - 3;

    const value = base + dailyPattern + weeklyPattern + trend + noise;

    inflow.push(Math.max(5, Math.round(value)));
  }

  return inflow;
};

module.exports = { generateMockInflow };