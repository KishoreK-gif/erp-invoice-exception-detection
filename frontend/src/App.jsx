import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemStatement from './components/ProblemStatement';
import StatsSection from './components/StatsSection';
import DataExplorer from './components/DataExplorer';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';
import { fetchStats } from './api';

export default function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#e3dcd1] text-[#414540]">
      <Navbar />
      <main className="flex-grow">
        <Hero stats={stats} loading={loading} />
        <ProblemStatement />
        <StatsSection stats={stats} loading={loading} />
        <DataExplorer />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}
