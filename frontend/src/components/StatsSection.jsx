import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Shield, Building2 } from 'lucide-react';

const CHART_COLORS = ['#414540', '#636962', '#868d85', '#a4aba3', '#c2c9c1'];
const PIE_COLORS = ['#b3b7b3', '#414540'];

export default function StatsSection({ stats, loading }) {
  const [activeTab, setActiveTab] = useState('breakdown');

  if (loading || !stats) {
    return (
      <section id="analytics" className="py-16 max-w-7xl mx-auto px-4 text-center">
        <div className="inline-block p-6 rounded-2xl bg-[#b3b7b3]/30 text-[#414540]">
          Loading exception analytics...
        </div>
      </section>
    );
  }

  // Format data for Recharts
  const breakdownData = (stats.exception_breakdown || []).map((item) => ({
    name: item.label,
    count: item.count,
    share: `${item.percentage}%`,
    amount: item.total_amount,
    amountFormatted: `$${(item.total_amount / 1_000_000).toFixed(2)}M`,
  }));

  const pieData = [
    { name: 'Clean (Straight-Through)', value: stats.clean_records || 17600 },
    { name: 'Flagged Exceptions', value: stats.exception_records || 2400 },
  ];

  const trendData = (stats.monthly_trend || []).slice(-12).map((item) => ({
    month: item.month,
    total: item.total_invoices,
    exceptions: item.exceptions,
    rate: item.exception_rate,
  }));

  return (
    <section id="analytics" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#414540]/75">
            Audit Telemetry & Aggregation
          </span>
          <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#414540] tracking-tight">
            Exception Breakdown & Anomaly Stats
          </h2>
          <p className="mt-2 text-base text-[#414540]/80 max-w-2xl">
            Real-time visual distribution of Accounts Payable risk factors across 20,000 transactions.
          </p>
        </div>

        {/* View toggle tabs */}
        <div className="mt-6 md:mt-0 flex items-center p-1 rounded-xl bg-[#b3b7b3]/40 border border-[#b3b7b3]">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'breakdown'
                ? 'bg-[#414540] text-[#e3dcd1] shadow-xs'
                : 'text-[#414540] hover:bg-[#b3b7b3]/40'
            }`}
          >
            Exception Distribution
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'trend'
                ? 'bg-[#414540] text-[#e3dcd1] shadow-xs'
                : 'text-[#414540] hover:bg-[#b3b7b3]/40'
            }`}
          >
            Monthly Trend
          </button>
        </div>
      </div>

      {/* Main Grid: Charts + Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Primary Chart Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#b3b7b3]/30 border border-[#b3b7b3] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#414540]" />
              <h3 className="text-lg font-bold text-[#414540]">
                {activeTab === 'breakdown' ? 'Volume by Exception Category' : '12-Month Anomaly Trend'}
              </h3>
            </div>
            <span className="text-xs text-[#414540]/70 font-medium">
              {activeTab === 'breakdown' ? '2,400 Total Injected Violations' : 'Monthly Volume & Exceptions'}
            </span>
          </div>

          <div className="w-full h-80">
            {activeTab === 'breakdown' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#b3b7b3" opacity={0.5} vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#414540"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    tick={{ fill: '#414540' }}
                  />
                  <YAxis stroke="#414540" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#e3dcd1',
                      borderColor: '#b3b7b3',
                      borderRadius: '12px',
                      color: '#414540',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    formatter={(val, name, item) => [
                      `${val.toLocaleString()} records (${item.payload.share}) • ${item.payload.amountFormatted} exposure`,
                      'Count',
                    ]}
                  />
                  <Bar dataKey="count" fill="#414540" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#b3b7b3" opacity={0.5} vertical={false} />
                  <XAxis dataKey="month" stroke="#414540" fontSize={11} tickLine={false} />
                  <YAxis stroke="#414540" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#e3dcd1',
                      borderColor: '#b3b7b3',
                      borderRadius: '12px',
                      color: '#414540',
                    }}
                    formatter={(val, name) => [val, name === 'exceptions' ? 'Exceptions' : 'Total Invoices']}
                  />
                  <Area type="monotone" dataKey="total" stackId="1" stroke="#868d85" fill="#b3b7b3" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="exceptions" stackId="2" stroke="#414540" fill="#414540" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#b3b7b3]/40 flex flex-wrap items-center justify-between text-xs text-[#414540]/80">
            <span>Primary driver: Amount Mismatch (30% share)</span>
            <span>Secondary driver: Duplicate Invoices (25% share)</span>
          </div>
        </div>

        {/* Right Column: Donut Proportion & Model Metrics */}
        <div className="space-y-6">
          {/* Donut Proportion */}
          <div className="p-6 rounded-3xl bg-[#b3b7b3]/30 border border-[#b3b7b3]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <PieIcon className="w-4 h-4 text-[#414540]" />
                <h3 className="text-base font-bold text-[#414540]">Clean vs Exception Ratio</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#414540] text-[#e3dcd1]">
                12% Anomaly Rate
              </span>
            </div>

            <div className="w-full h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#e3dcd1',
                      borderColor: '#b3b7b3',
                      borderRadius: '8px',
                      color: '#414540',
                    }}
                    formatter={(val) => [`${val.toLocaleString()} records`, 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-around text-xs text-[#414540] font-medium mt-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#b3b7b3]"></span>
                <span>Clean: 88.0% (17.6k)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#414540]"></span>
                <span>Flagged: 12.0% (2.4k)</span>
              </div>
            </div>
          </div>

          {/* Model Metrics Card */}
          <div className="p-6 rounded-3xl bg-[#414540] text-[#e3dcd1] border border-[#414540]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#e3dcd1]" />
                <h3 className="text-base font-bold text-[#e3dcd1]">Model Performance</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#e3dcd1]/20 text-[#e3dcd1] font-mono">
                XGBoost + IF
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#e3dcd1]/10">
                <span className="text-xs text-[#e3dcd1]/70 block">Precision</span>
                <span className="text-lg font-bold">97.2%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#e3dcd1]/10">
                <span className="text-xs text-[#e3dcd1]/70 block">Recall</span>
                <span className="text-lg font-bold">96.8%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#e3dcd1]/10">
                <span className="text-xs text-[#e3dcd1]/70 block">F1-Score</span>
                <span className="text-lg font-bold">97.0%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#e3dcd1]/10">
                <span className="text-xs text-[#e3dcd1]/70 block">Inference</span>
                <span className="text-lg font-bold">4.6 ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Risk Vendors Bar */}
      {stats.top_risk_vendors && stats.top_risk_vendors.length > 0 && (
        <div className="mt-8 p-6 rounded-3xl bg-[#b3b7b3]/25 border border-[#b3b7b3]">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="w-4 h-4 text-[#414540]" />
            <h3 className="text-base font-bold text-[#414540]">
              Top Monitored Vendors by Financial Risk Exposure
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.top_risk_vendors.slice(0, 4).map((v) => (
              <div key={v.vendor_id} className="p-4 rounded-2xl bg-[#e3dcd1] border border-[#b3b7b3]/60">
                <div className="flex items-center justify-between text-xs font-mono text-[#414540]/70">
                  <span>{v.vendor_id}</span>
                  <span className="font-bold text-rose-900 bg-rose-100 px-1.5 py-0.5 rounded">
                    {v.exception_rate}% Risk
                  </span>
                </div>
                <h4 className="mt-1 font-bold text-sm text-[#414540] truncate" title={v.vendor_name}>
                  {v.vendor_name}
                </h4>
                <div className="mt-2 flex justify-between items-baseline text-xs text-[#414540]/80">
                  <span>Flagged Spend:</span>
                  <span className="font-bold text-[#414540]">
                    ${v.flagged_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
