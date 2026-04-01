import { useState, useMemo, useEffect } from "react";

const COLORS = {
  food: "#F97316", shopping: "#8B5CF6", transport: "#06B6D4",
  utilities: "#10B981", health: "#F43F5E", entertainment: "#FBBF24",
  salary: "#22C55E", freelance: "#3B82F6", other: "#94A3B8"
};

const INITIAL_TXN = [
  { id: 1, date: "2024-03-01", desc: "Grocery Store", amount: 4200, category: "food", type: "expense" },
  { id: 2, date: "2024-03-02", desc: "Monthly Salary", amount: 85000, category: "salary", type: "income" },
  { id: 3, date: "2024-03-03", desc: "Uber Ride", amount: 650, category: "transport", type: "expense" },
  { id: 4, date: "2024-03-05", desc: "Netflix", amount: 799, category: "entertainment", type: "expense" },
  { id: 5, date: "2024-03-07", desc: "Electricity Bill", amount: 2100, category: "utilities", type: "expense" },
  { id: 6, date: "2024-03-08", desc: "Freelance Project", amount: 15000, category: "freelance", type: "income" },
  { id: 7, date: "2024-03-10", desc: "Amazon Shopping", amount: 3400, category: "shopping", type: "expense" },
  { id: 8, date: "2024-03-12", desc: "Doctor Visit", amount: 1200, category: "health", type: "expense" },
  { id: 9, date: "2024-03-14", desc: "Restaurant", amount: 1800, category: "food", type: "expense" },
  { id: 10, date: "2024-03-15", desc: "Bonus", amount: 10000, category: "salary", type: "income" },
  { id: 11, date: "2024-03-16", desc: "Zomato Order", amount: 420, category: "food", type: "expense" },
  { id: 12, date: "2024-03-17", desc: "Metro Card", amount: 500, category: "transport", type: "expense" },
  { id: 13, date: "2024-03-18", desc: "Gym Membership", amount: 1500, category: "health", type: "expense" },
  { id: 14, date: "2024-03-20", desc: "Freelance Design", amount: 8000, category: "freelance", type: "income" },
  { id: 15, date: "2024-03-22", desc: "New Shoes", amount: 4500, category: "shopping", type: "expense" },
  { id: 16, date: "2024-03-23", desc: "Internet Bill", amount: 999, category: "utilities", type: "expense" },
  { id: 17, date: "2024-03-25", desc: "Movie Tickets", amount: 800, category: "entertainment", type: "expense" },
  { id: 18, date: "2024-03-26", desc: "Pharmacy", amount: 350, category: "health", type: "expense" },
  { id: 19, date: "2024-03-28", desc: "Swiggy Order", amount: 380, category: "food", type: "expense" },
  { id: 20, date: "2024-03-30", desc: "Freelance Bonus", amount: 5000, category: "freelance", type: "income" },
  { id: 21, date: "2024-02-01", desc: "Grocery Store", amount: 3900, category: "food", type: "expense" },
  { id: 22, date: "2024-02-02", desc: "Monthly Salary", amount: 85000, category: "salary", type: "income" },
  { id: 23, date: "2024-02-05", desc: "Shopping Mall", amount: 6200, category: "shopping", type: "expense" },
  { id: 24, date: "2024-02-10", desc: "Electricity Bill", amount: 1800, category: "utilities", type: "expense" },
  { id: 25, date: "2024-02-15", desc: "Freelance Work", amount: 12000, category: "freelance", type: "income" },
  { id: 26, date: "2024-02-18", desc: "Cab Rides", amount: 1200, category: "transport", type: "expense" },
  { id: 27, date: "2024-02-22", desc: "Restaurant Dinner", amount: 2400, category: "food", type: "expense" },
  { id: 28, date: "2024-02-25", desc: "Spotify", amount: 119, category: "entertainment", type: "expense" },
  { id: 29, date: "2024-01-02", desc: "Monthly Salary", amount: 85000, category: "salary", type: "income" },
  { id: 30, date: "2024-01-10", desc: "New Year Shopping", amount: 8500, category: "shopping", type: "expense" },
  { id: 31, date: "2024-01-15", desc: "Freelance Work", amount: 18000, category: "freelance", type: "income" },
  { id: 32, date: "2024-01-20", desc: "Restaurant", amount: 1600, category: "food", type: "expense" },
  { id: 33, date: "2024-01-25", desc: "Medical Tests", amount: 2200, category: "health", type: "expense" },
];

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

const MiniSparkline = ({ data, color }) => {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 30;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * h} r="3" fill={color} />
    </svg>
  );
};

const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cum = 0;
  const slices = data.map(d => {
    const pct = d.value / total;
    const start = cum, end = cum + pct;
    cum = end;
    const s = start * 2 * Math.PI - Math.PI / 2;
    const e = end * 2 * Math.PI - Math.PI / 2;
    const r = 70, ir = 44, cx = 90, cy = 90;
    const lx = cx + r * Math.cos(s), ly = cy + r * Math.sin(s);
    const lx2 = cx + r * Math.cos(e), ly2 = cy + r * Math.sin(e);
    const ix = cx + ir * Math.cos(e), iy = cy + ir * Math.sin(e);
    const ix2 = cx + ir * Math.cos(s), iy2 = cy + ir * Math.sin(s);
    const large = pct > 0.5 ? 1 : 0;
    return { ...d, path: `M ${lx} ${ly} A ${r} ${r} 0 ${large} 1 ${lx2} ${ly2} L ${ix} ${iy} A ${ir} ${ir} 0 ${large} 0 ${ix2} ${iy2} Z`, pct };
  });
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg width="180" height="180" style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} opacity={hovered === null || hovered === i ? 1 : 0.4}
            style={{ cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
        ))}
        <text x="90" y="85" textAnchor="middle" style={{ fontSize: 11, fill: "var(--muted)", fontFamily: "inherit" }}>Total</text>
        <text x="90" y="103" textAnchor="middle" style={{ fontSize: 13, fill: "var(--text)", fontFamily: "inherit", fontWeight: 600 }}>
          {hovered !== null ? fmt(slices[hovered].value) : fmt(total)}
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: hovered === null || hovered === i ? 1 : 0.4, transition: "opacity 0.2s", cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "var(--muted)", flex: 1, textTransform: "capitalize" }}>{s.label}</span>
            <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{(s.pct * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, label }) => {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "var(--muted)", width: 28, textAlign: "right", flexShrink: 0 }}>{d.label}</span>
          <div style={{ flex: 1, background: "var(--bg2)", borderRadius: 4, height: 22, overflow: "hidden" }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 8, transition: "width 0.6s ease", minWidth: d.value > 0 ? 36 : 0 }}>
              {d.value > 0 && <span style={{ fontSize: 11, color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>{fmt(d.value)}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data }) => {
  const vals = data.map(d => d.value);
  const max = Math.max(...vals), min = Math.min(...vals);
  const range = max - min || 1;
  const W = 420, H = 120, pad = 12;
  const pts = vals.map((v, i) => ({ x: pad + (i / (vals.length - 1)) * (W - 2 * pad), y: H - pad - ((v - min) / range) * (H - 2 * pad) }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${path} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;
  const [tip, setTip] = useState(null);
  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#lg)" />
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--accent)" stroke="var(--card)" strokeWidth="2"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setTip({ ...p, ...data[i] })}
            onMouseLeave={() => setTip(null)} />
        ))}
        {tip && (
          <g>
            <rect x={tip.x - 36} y={tip.y - 34} width="72" height="26" rx="5" fill="var(--text)" />
            <text x={tip.x} y={tip.y - 16} textAnchor="middle" style={{ fontSize: 11, fill: "var(--bg)", fontWeight: 700, fontFamily: "inherit" }}>{fmt(tip.value)}</text>
          </g>
        )}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {data.map((d, i) => <span key={i} style={{ fontSize: 10, color: "var(--muted)" }}>{d.label}</span>)}
      </div>
    </div>
  );
};

const Modal = ({ onClose, onSave, editTxn }) => {
  const [form, setForm] = useState(editTxn || { date: new Date().toISOString().split("T")[0], desc: "", amount: "", category: "food", type: "expense" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={onClose}>
      <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 420, border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{editTxn ? "Edit Transaction" : "Add Transaction"}</h3>
        {[["Date", "date", "date"], ["Description", "desc", "text"], ["Amount (₹)", "amount", "number"]].map(([l, k, t]) => (
          <div key={k} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 5 }}>{l}</label>
            <input type={t} value={form[k]} onChange={e => set(k, e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: 14, outline: "none" }} />
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 5 }}>Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: 14 }}>
              {Object.keys(COLORS).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 5 }}>Type</label>
            <select value={form.type} onChange={e => set("type", e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: 14 }}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>Cancel</button>
          <button onClick={() => { if (!form.desc || !form.amount || !form.date) return; onSave({ ...form, amount: parseFloat(form.amount), id: editTxn?.id || Date.now() }); onClose(); }}
            style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [dark, setDark] = useState(true);
  const [role, setRole] = useState("admin");
  const [tab, setTab] = useState("overview");
  const [txns, setTxns] = useState(INITIAL_TXN);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [showModal, setShowModal] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  const isAdmin = role === "admin";

  const css = dark ? {
    "--bg": "#0F1117", "--bg2": "#1A1D27", "--card": "#1E2130",
    "--border": "#2A2E3E", "--text": "#F0F2FF", "--muted": "#6B7094",
    "--accent": "#7C6AF7", "--pos": "#22D3A5", "--neg": "#F56565",
  } : {
    "--bg": "#F4F5FA", "--bg2": "#ECEEF7", "--card": "#FFFFFF",
    "--border": "#DDE0F0", "--text": "#1A1C2E", "--muted": "#8B8DAA",
    "--accent": "#6253E1", "--pos": "#10B981", "--neg": "#EF4444",
  };

  const totalIncome = txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = txns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const catSpend = useMemo(() => {
    const m = {};
    txns.filter(t => t.type === "expense").forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [txns]);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar"];
    return months.map(label => {
      const mIdx = ["Jan", "Feb", "Mar"].indexOf(label) + 1;
      const val = txns.filter(t => t.type === "expense" && new Date(t.date).getMonth() + 1 === mIdx).reduce((s, t) => s + t.amount, 0);
      return { label, value: val };
    });
  }, [txns]);

  const balanceTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar"];
    return months.map(label => {
      const mIdx = ["Jan", "Feb", "Mar"].indexOf(label) + 1;
      const inc = txns.filter(t => t.type === "income" && new Date(t.date).getMonth() + 1 === mIdx).reduce((s, t) => s + t.amount, 0);
      const exp = txns.filter(t => t.type === "expense" && new Date(t.date).getMonth() + 1 === mIdx).reduce((s, t) => s + t.amount, 0);
      return { label, value: inc - exp };
    });
  }, [txns]);

  const filtered = useMemo(() => {
    let list = [...txns];
    if (search) list = list.filter(t => t.desc.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (filterCat !== "all") list = list.filter(t => t.category === filterCat);
    const [key, dir] = sortBy.split("_");
    list.sort((a, b) => {
      let va = a[key === "date" ? "date" : "amount"], vb = b[key === "date" ? "date" : "amount"];
      if (key === "date") return dir === "desc" ? vb.localeCompare(va) : va.localeCompare(vb);
      return dir === "desc" ? vb - va : va - vb;
    });
    return list;
  }, [txns, search, filterType, filterCat, sortBy]);

  const topCat = catSpend[0];
  const febExp = monthlyData.find(m => m.label === "Feb")?.value || 0;
  const marExp = monthlyData.find(m => m.label === "Mar")?.value || 0;
  const expDelta = marExp - febExp;

  const incomeSparkData = monthlyData.map((m, i) => {
    const mIdx = i + 1;
    return txns.filter(t => t.type === "income" && new Date(t.date).getMonth() + 1 === mIdx).reduce((s, t) => s + t.amount, 0);
  });

  const Card = ({ children, style = {} }) => (
    <div style={{ background: "var(--card)", borderRadius: 16, padding: 20, border: "1px solid var(--border)", ...style }}>{children}</div>
  );

  const tabs = ["overview", "transactions", "insights"];

  return (
    <div style={{ ...css, background: "var(--bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        input, select { font-family: 'DM Sans', sans-serif; }
        .tab-btn { background: transparent; border: none; cursor: pointer; padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 500; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .tab-btn:hover { background: var(--bg2); }
        .tab-btn.active { background: var(--accent); color: #fff !important; }
        .txn-row:hover { background: var(--bg2) !important; }
        .icon-btn { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; cursor: pointer; font-size: 14px; transition: all 0.15s; color: var(--muted); }
        .icon-btn:hover { border-color: var(--accent); color: var(--accent); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", display: "flex", alignItems: "center", height: 60, gap: 16, position: "sticky", top: 0, background: "var(--bg)", zIndex: 100 }}>
        <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>
          <span style={{ color: "var(--accent)" }}>fin</span>sight
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 4, background: "var(--bg2)", padding: 4, borderRadius: 12 }}>
          {tabs.map(t => (
            <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} style={{ color: tab === t ? "#fff" : "var(--muted)", textTransform: "capitalize" }} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <select value={role} onChange={e => setRole(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: 13, cursor: "pointer" }}>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        <button onClick={() => setDark(!dark)} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Role badge */}
      {!isAdmin && (
        <div style={{ background: "rgba(124,106,247,0.1)", borderBottom: "1px solid rgba(124,106,247,0.2)", padding: "8px 24px", fontSize: 13, color: "var(--accent)", display: "flex", alignItems: "center", gap: 8 }}>
          <span>👁</span> Viewer mode — read only access
        </div>
      )}

      <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="fade-in">
            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
              {[
                { label: "Total Balance", value: balance, color: balance >= 0 ? "var(--pos)" : "var(--neg)", spark: balanceTrend.map(d => d.value) },
                { label: "Total Income", value: totalIncome, color: "var(--pos)", spark: incomeSparkData },
                { label: "Total Expenses", value: totalExpense, color: "var(--neg)", spark: monthlyData.map(d => d.value) },
                { label: "Transactions", value: txns.length, color: "var(--accent)", isCount: true },
              ].map((c, i) => (
                <Card key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>{c.label}</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: "'DM Mono', monospace", letterSpacing: -0.5 }}>
                        {c.isCount ? c.value : fmt(c.value)}
                      </p>
                    </div>
                    {c.spark && <MiniSparkline data={c.spark} color={c.color} />}
                  </div>
                </Card>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <Card>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--muted)" }}>BALANCE TREND</p>
                <LineChart data={balanceTrend} />
              </Card>
              <Card>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--muted)" }}>SPENDING BY CATEGORY</p>
                <DonutChart data={catSpend.map(([k, v]) => ({ label: k, value: v, color: COLORS[k] || "#888" }))} />
              </Card>
            </div>

            <Card>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--muted)" }}>MONTHLY EXPENSES</p>
              <BarChart data={monthlyData} />
            </Card>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {tab === "transactions" && (
          <div className="fade-in">
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search transactions..."
                style={{ flex: "1 1 220px", padding: "9px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 14, outline: "none" }} />
              <select value={filterType} onChange={e => setFilterType(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 13 }}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 13 }}>
                <option value="all">All Categories</option>
                {Object.keys(COLORS).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 13 }}>
                <option value="date_desc">Date ↓</option>
                <option value="date_asc">Date ↑</option>
                <option value="amount_desc">Amount ↓</option>
                <option value="amount_asc">Amount ↑</option>
              </select>
              {isAdmin && (
                <button onClick={() => { setEditTxn(null); setShowModal(true); }}
                  style={{ padding: "9px 18px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit" }}>
                  + Add
                </button>
              )}
            </div>

            <Card style={{ padding: 0, overflow: "hidden" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                  <p style={{ fontSize: 15 }}>No transactions found</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {["Date", "Description", "Category", "Type", "Amount", ...(isAdmin ? ["Actions"] : [])].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(t => (
                        <tr key={t.id} className="txn-row" style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s", cursor: "default" }}>
                          <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--muted)", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{t.date}</td>
                          <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500 }}>{t.desc}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: (COLORS[t.category] || "#888") + "22", color: COLORS[t.category] || "#888", textTransform: "capitalize" }}>{t.category}</span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: t.type === "income" ? "var(--pos)" : "var(--neg)", textTransform: "uppercase", letterSpacing: 0.5 }}>{t.type}</span>
                          </td>
                          <td style={{ padding: "12px 16px", fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 14, color: t.type === "income" ? "var(--pos)" : "var(--neg)", whiteSpace: "nowrap" }}>
                            {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                          </td>
                          {isAdmin && (
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button className="icon-btn" onClick={() => { setEditTxn(t); setShowModal(true); }}>✏️</button>
                                <button className="icon-btn" onClick={() => setTxns(prev => prev.filter(x => x.id !== t.id))}>🗑️</button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
            <p style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>{filtered.length} of {txns.length} transactions</p>
          </div>
        )}

        {/* INSIGHTS TAB */}
        {tab === "insights" && (
          <div className="fade-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
              {[
                {
                  icon: "🏆", title: "Top Spending Category",
                  value: topCat ? topCat[0].charAt(0).toUpperCase() + topCat[0].slice(1) : "—",
                  sub: topCat ? `${fmt(topCat[1])} total spent` : "",
                  color: topCat ? COLORS[topCat[0]] : "var(--accent)"
                },
                {
                  icon: "📊", title: "Mar vs Feb Expenses",
                  value: expDelta >= 0 ? `+${fmt(expDelta)}` : fmt(expDelta),
                  sub: expDelta >= 0 ? "More spent in March" : "Less spent in March",
                  color: expDelta >= 0 ? "var(--neg)" : "var(--pos)"
                },
                {
                  icon: "💰", title: "Savings Rate",
                  value: totalIncome > 0 ? `${((balance / totalIncome) * 100).toFixed(1)}%` : "—",
                  sub: "Of total income saved",
                  color: balance > 0 ? "var(--pos)" : "var(--neg)"
                },
                {
                  icon: "📈", title: "Avg Transaction",
                  value: txns.length > 0 ? fmt(Math.round(txns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0) / txns.filter(t => t.type === "expense").length)) : "—",
                  sub: "Per expense transaction",
                  color: "var(--accent)"
                },
              ].map((ins, i) => (
                <Card key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 24 }}>{ins.icon}</div>
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{ins.title}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: ins.color, fontFamily: "'DM Mono', monospace" }}>{ins.value}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>{ins.sub}</p>
                </Card>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Card>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--muted)" }}>SPENDING BREAKDOWN</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {catSpend.map(([cat, val]) => {
                    const pct = (val / totalExpense) * 100;
                    return (
                      <div key={cat}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, textTransform: "capitalize", fontWeight: 500 }}>{cat}</span>
                          <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "'DM Mono', monospace" }}>{fmt(val)} <span style={{ color: COLORS[cat] }}>({pct.toFixed(0)}%)</span></span>
                        </div>
                        <div style={{ height: 6, background: "var(--bg2)", borderRadius: 4 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: COLORS[cat] || "#888", borderRadius: 4, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--muted)" }}>MONTHLY COMPARISON</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {monthlyData.map((m, i) => {
                    const inc = txns.filter(t => t.type === "income" && new Date(t.date).getMonth() === i).reduce((s, t) => s + t.amount, 0);
                    const net = inc - m.value;
                    return (
                      <div key={m.label} style={{ background: "var(--bg2)", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 15 }}>{m.label} 2024</span>
                          <span style={{ fontWeight: 700, fontSize: 15, color: net >= 0 ? "var(--pos)" : "var(--neg)", fontFamily: "'DM Mono', monospace" }}>{net >= 0 ? "+" : ""}{fmt(net)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
                          <span>Income: <span style={{ color: "var(--pos)", fontWeight: 600 }}>{fmt(inc)}</span></span>
                          <span>Expenses: <span style={{ color: "var(--neg)", fontWeight: 600 }}>{fmt(m.value)}</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(124,106,247,0.08)", borderRadius: 10, border: "1px solid rgba(124,106,247,0.2)" }}>
                  <p style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>💡 Insight</p>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
                    {expDelta > 0
                      ? `Spending increased by ${fmt(expDelta)} in March vs February. Consider reviewing ${topCat?.[0] || "discretionary"} expenses.`
                      : `Great! Spending decreased by ${fmt(Math.abs(expDelta))} in March vs February. Keep it up!`}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          editTxn={editTxn}
          onClose={() => { setShowModal(false); setEditTxn(null); }}
          onSave={data => {
            if (editTxn) setTxns(prev => prev.map(t => t.id === data.id ? data : t));
            else setTxns(prev => [data, ...prev]);
          }}
        />
      )}
    </div>
  );
}
