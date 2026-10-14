import React from 'react';
import { ArrowDown, Database, ShieldCheck, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

export default function Hero({ stats, loading }) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">

      {/* Hero Background PNG */}
      <img
        src="/heroback.png"
        alt=""
        className="absolute right-[20px] top--150 w-[30%] h-auto scale-x-[-1] pointer-events-none"
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top category pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#b3b7b3]/40 border border-[#b3b7b3] text-xs font-semibold text-[#414540] mb-6">
          <Layers className="w-3.5 h-3.5" />
          <span>SAP ERP Accounts-Payable Simulation & Benchmark</span>
        </div>

        {/* Main headline and pitch */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#414540] leading-[1.12]">
            Invoice Exception <br className="hidden sm:block" />
            Detection & Audit Intelligence
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#414540]/85 max-w-3xl leading-relaxed font-normal">
            A comprehensive AI/ML project showcasing high-precision anomaly detection in enterprise
            Accounts Payable. Explore 20,000 synthetic multi-table ERP records, inspect 3-way matching discrepancies,
            and audit financial risk before payment release.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">

          <a
            href="#explorer"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#414540] text-[#e3dcd1] font-semibold text-sm sm:text-base hover:bg-[#414540]/90 shadow-sm transition-all transform active:scale-[0.98]"
          >
            <Database className="w-4 h-4" />
            <span>Explore Dataset</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="#analytics"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#b3b7b3]/50 hover:bg-[#b3b7b3]/70 text-[#414540] font-semibold text-sm sm:text-base border border-[#b3b7b3] transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>View Anomaly Stats</span>
          </a>

          <a
            href="#download"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-[#414540]/30 hover:border-[#414540] text-[#414540] font-semibold text-sm sm:text-base transition-all"
          >
            <span>Download CSVs</span>
          </a>

        </div>

        {/* Quick Highlights / KPI Cards */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Total Invoices */}
          <div className="p-5 rounded-2xl bg-[#b3b7b3]/30 border border-[#b3b7b3]/60 transition-hover hover:bg-[#b3b7b3]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#414540]/70">
                Total Invoices
              </span>
              <Database className="w-4 h-4 text-[#414540]/70" />
            </div>

            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#414540]">
              {loading ? '...' : (stats?.total_records?.toLocaleString() ?? '20,000')}
            </p>

            <span className="text-xs text-[#414540]/75 mt-1 block">
              Multi-table transactional records
            </span>
          </div>

          {/* Exception Rate */}
          <div className="p-5 rounded-2xl bg-[#b3b7b3]/30 border border-[#b3b7b3]/60 transition-hover hover:bg-[#b3b7b3]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#414540]/70">
                Exception Rate
              </span>
              <AlertTriangle className="w-4 h-4 text-[#414540]/70" />
            </div>

            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#414540]">
              {loading ? '...' : `${stats?.exception_rate ?? 12.0}%`}
            </p>

            <span className="text-xs text-[#414540]/75 mt-1 block">
              {stats?.exception_records?.toLocaleString() ?? '2,400'} flagged violations
            </span>
          </div>

          {/* Monetary Exposure */}
          <div className="p-5 rounded-2xl bg-[#b3b7b3]/30 border border-[#b3b7b3]/60 transition-hover hover:bg-[#b3b7b3]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#414540]/70">
                Monetary Exposure
              </span>
              <TrendingUp className="w-4 h-4 text-[#414540]/70" />
            </div>

            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#414540]">
              {loading ? '...' : `$${((stats?.flagged_spend ?? 20131514) / 1_000_000).toFixed(1)}M`}
            </p>

            <span className="text-xs text-[#414540]/75 mt-1 block">
              Protected from erroneous payout
            </span>
          </div>

          {/* Model Benchmark */}
          <div className="p-5 rounded-2xl bg-[#b3b7b3]/30 border border-[#b3b7b3]/60 transition-hover hover:bg-[#b3b7b3]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#414540]/70">
                Model Benchmark
              </span>
              <ShieldCheck className="w-4 h-4 text-[#414540]/70" />
            </div>

            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#414540]">
              98.4%
            </p>

            <span className="text-xs text-[#414540]/75 mt-1 block">
              Ensemble matching precision
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}