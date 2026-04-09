import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Activity,
  Server as ServerIcon,
  Zap,
  TrendingUp,
} from "lucide-react";
import "./App.css";

type Server = {
  id: number;
  name: string;
  load: number;
  requests: number;
};

type History = {
  time: number;
  s1: number;
  s2: number;
  s3: number;
  s4: number;
};

export default function App() {
  const [servers, setServers] = useState<Server[]>([
    { id: 1, name: "Server 1", load: 0, requests: 0 },
    { id: 2, name: "Server 2", load: 0, requests: 0 },
    { id: 3, name: "Server 3", load: 0, requests: 0 },
    { id: 4, name: "Server 4", load: 0, requests: 0 },
  ]);

  const [history, setHistory] = useState<History[]>([]);
  const [algorithm, setAlgorithm] = useState("roundRobin");
  const [running, setRunning] = useState(false);
  const [total, setTotal] = useState(0);
  const [speed, setSpeed] = useState(1500); // traffic rate

  const rrRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setServers((prev) => {
        const next = prev.map((s) => ({ ...s }));

        let index = 0;
        if (algorithm === "roundRobin") {
          index = rrRef.current;
          rrRef.current = (rrRef.current + 1) % next.length;
        } else {
          index = next.reduce(
            (min, s, i) => (s.load < next[min].load ? i : min),
            0
          );
        }

        next[index].load = Math.min(100, next[index].load + 12);
        next[index].requests++;
        next.forEach((s, i) => {
          if (i !== index) {
            s.load = Math.max(0, s.load - 4);
          }
        });


        setHistory((h) => [
          ...h.slice(-19),
          {
            time: h.length,
            s1: next[0].load,
            s2: next[1].load,
            s3: next[2].load,
            s4: next[3].load,
          },
        ]);

        return next;
      });

      setTotal((t) => t + 1);
    }, speed);

    return () => clearInterval(interval);
  }, [running, algorithm, speed]);

  const avgLoad = Math.round(
    servers.reduce((s, x) => s + x.load, 0) / servers.length
  );

  return (
    <div className="app">
      <h1>Load Balancer Simulator</h1>
      <p className="subtitle">
        Real-time traffic distribution across multiple servers
      </p>

      {/* CONTROL PANEL */}
      <div className="control-panel">
        <div className="cp-header">
          <Activity />
          <h2>Control Panel</h2>
        </div>

        <div className="stats">
          <div className="stat-card">
            <Zap />
            <span>Total Requests</span>
            <strong>{total}</strong>
          </div>
          <div className="stat-card">
            <TrendingUp />
            <span>Avg Load</span>
            <strong>{avgLoad}%</strong>
          </div>
        </div>

        <label>Load Balancing Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="roundRobin">Round Robin</option>
          <option value="leastConnections">Least Connections</option>
        </select>

        <label>Traffic Rate</label>
        <input
          type="range"
          min="500"
          max="3000"
          step="250"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="slider"
        />
        <p className="slider-text">
          {speed <= 1000
            ? "High Traffic"
            : speed <= 2000
            ? "Medium Traffic"
            : "Low Traffic"}
        </p>

        <div className="buttons">
          <button
            className={running ? "stop" : "start"}
            onClick={() => setRunning((p) => !p)}
          >
            {running ? "Stop Simulation" : "Start Simulation"}
          </button>
          <button className="reset" onClick={() => window.location.reload()}>
            Reset
          </button>
        </div>
      </div>

      {/* SERVERS */}
      <div className="servers">
        {servers.map((s) => {
          const overloaded = s.load > 80;

          return (
            <div key={s.id} className="server-card">
              <div className="server-header">
                <div className="server-title">
                  <ServerIcon />
                  <h3>{s.name}</h3>
                </div>
                <span className={`dot ${overloaded ? "overloaded" : ""}`} />
              </div>

              <div className="row">
                <span>Load</span>
                <span>{s.load}%</span>
              </div>

              <div className="progress">
                <div
                  className={`bar ${s.load > 80 ? "bar-red" : s.load > 50 ? "bar-yellow" : ""}`}
                  style={{ width: `${s.load}%` }}
                />
              </div>

              <div className="row">
                <span>Requests</span>
                <span>{s.requests}</span>
              </div>

              <span className={`status ${overloaded ? "bad" : "good"}`}>
                {overloaded ? "Overloaded" : "Healthy"}
              </span>
            </div>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="chart-card">
        <h2>Server Load Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={servers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="load" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>

        <h2>Load History (Last 20 Updates)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="s1" stroke="#22c55e" />
            <Line dataKey="s2" stroke="#3b82f6" />
            <Line dataKey="s3" stroke="#f59e0b" />
            <Line dataKey="s4" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
