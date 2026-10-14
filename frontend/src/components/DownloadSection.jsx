import React from 'react';
import { Download, FileSpreadsheet, Archive, Check, FileText } from 'lucide-react';
import { getDownloadUrl } from '../api';

const DATASET_FILES = [
  {
    id: 'invoices',
    name: 'invoices.csv',
    size: '2.4 MB',
    records: '20,000 records',
    columns: '13 columns',
    desc: 'Primary transactional invoice table containing invoice IDs, dates, billed amounts, taxes, vendor mapping, PO references, bank account numbers, and ground-truth exception labels.',
  },
  {
    id: 'purchase_orders',
    name: 'purchase_orders.csv',
    size: '846 KB',
    records: '16,500 records',
    columns: '5 columns',
    desc: 'ERP authorized purchase order table with PO numbers, assigned vendor IDs, authorized PO values, issue dates, and expected delivery milestone dates.',
  },
  {
    id: 'vendors',
    name: 'vendors.csv',
    size: '15 KB',
    records: '220 records',
    columns: '6 columns',
    desc: 'Master vendor directory with official verified bank routing numbers, typical minimum/maximum invoice thresholds, and historical vendor spend averages.',
  },
];

export default function DownloadSection() {
  return (
    <section id="download" className="py-16 md:py-24 bg-[#b3b7b3]/20 border-t border-[#b3b7b3]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#414540]/75">
              Open Synthetic Dataset
            </span>
            <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#414540] tracking-tight">
              Download the ERP Dataset
            </h2>
            <p className="mt-2 text-base text-[#414540]/80">
              Download the entire relational 3-file benchmark or individual CSVs for local testing, model training,
              and accounts-payable research.
            </p>
          </div>

          {/* Master zip download button */}
          <div className="mt-6 md:mt-0">
            <a
              href={getDownloadUrl('all')}
              download="erp_invoice_dataset_bundle.zip"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-[#414540] text-[#e3dcd1] font-semibold text-sm hover:bg-[#414540]/90 shadow-sm transition-all transform active:scale-[0.98]"
            >
              <Archive className="w-5 h-5" />
              <span>Download Full Dataset (.ZIP)</span>
              <span className="text-xs bg-[#e3dcd1]/20 px-2 py-0.5 rounded-full font-mono">
                ~1.0 MB
              </span>
            </a>
          </div>
        </div>

        {/* 3 CSV Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DATASET_FILES.map((file) => (
            <div
              key={file.id}
              className="p-6 rounded-3xl bg-[#e3dcd1] border border-[#b3b7b3] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#414540] text-[#e3dcd1] flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#b3b7b3]/40 text-[#414540]">
                    {file.size}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#414540] font-mono">
                  {file.name}
                </h3>

                <div className="flex items-center space-x-3 text-xs text-[#414540]/70 font-medium mt-1 mb-3">
                  <span>{file.records}</span>
                  <span>•</span>
                  <span>{file.columns}</span>
                </div>

                <p className="text-xs text-[#414540]/80 leading-relaxed">
                  {file.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#b3b7b3]/50">
                <a
                  href={getDownloadUrl(file.id)}
                  download={file.name}
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-[#414540] text-[#414540] font-semibold text-xs hover:bg-[#414540] hover:text-[#e3dcd1] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {file.name}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Reproducibility and Schema Note */}
        <div className="mt-10 p-6 rounded-2xl bg-[#e3dcd1] border border-[#b3b7b3]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#414540]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#b3b7b3]/50 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[#414540]" />
            </div>
            <div>
              <span className="font-bold block">Deterministic Synthetic Generation:</span>
              <span>Generated with random seed 20260914 via Faker and NumPy. 100% ground-truth verifiable.</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#b3b7b3]/40 font-mono">
              <Check className="w-3 h-3 text-emerald-800" />
              <span>UTF-8 CSV Format</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
