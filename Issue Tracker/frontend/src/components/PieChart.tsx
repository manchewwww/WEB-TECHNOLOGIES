import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../styles/PieChart.css";

type PieChartBlockProps = {
  title?: string;
  data: Record<string, number>;
  theme: string;
  allKeys?: string[];
};

function getColorFromCSS(variableName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

const PieChartBlock = ({ title, data, theme, allKeys }: PieChartBlockProps) => {
  const keys = allKeys ?? Object.keys(data);

  const colorMap: Record<string, string> = {};
  keys.forEach((key) => {
    const varName = `--${theme}-${key.replace("_", "-")}`;
    colorMap[key] = getColorFromCSS(varName);
  });

  // Only include keys with value > 0
  const filteredKeys = keys.filter((key) => (data[key] ?? 0) > 0);
  const chartData = filteredKeys.map((key) => ({
    name:
      theme === 'status'
        ? key === 'in_progress'
          ? 'In Progress'
          : key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')
        : theme === 'priority'
        ? key.charAt(0).toUpperCase() + key.slice(1)
        : key,
    value: data[key] ?? 0,
    rawKey: key,
  }));

  return (
    <div className="pie-chart-block">
      {title && <h4 className="chart-title">{title}</h4>}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap[entry.rawKey]}/>
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartBlock;