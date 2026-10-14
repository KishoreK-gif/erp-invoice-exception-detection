import React from 'react';
import { DollarSign, Copy, FileQuestion, Landmark, CalendarClock, CheckCircle2 } from 'lucide-react';

const EXCEPTION_CARDS = [
  {
    icon: DollarSign,
    title: "Amount & Quantity Mismatch",
    share: "30% of exceptions",
    desc: "The invoice amount or quantity is higher than what was approved in the ERP Purchase Order, which can result in overcharging and reduced profit.",
  },
  {
    icon: Copy,
    title: "Duplicate Invoices",
    share: "25% of exceptions",
    desc: "The same invoice is submitted more than once in different processing periods or company branches, which can lead to paying the same invoice twice.",
  },
  {
    icon: FileQuestion,
    title: "Missing / Invalid PO References",
    share: "20% of exceptions",
    desc: "Invoices missing an approved Purchase Order number, referencing a closed PO, or bypassing standard procurement channels ('maverick spend').",
  },
  {
    icon: Landmark,
    title: "Vendor Bank Detail Tampering",
    share: "15% of exceptions",
    desc: "Sudden modifications to vendor bank routing details without dual-approval verification—a primary vector for business email compromise (BEC) fraud.",
  },
  {
    icon: CalendarClock,
    title: "Date & Payment Term Anomalies",
    share: "10% of exceptions",
    desc: "Due dates defying sequential procurement logic (e.g. invoice date preceding PO generation) or violating contracted Net 30/60/90 terms.",
  },
];

export default function ProblemStatement() {
  return (
    <section id="problem" className="py-16 md:py-24 bg-[#b3b7b3]/25 border-y border-[#b3b7b3]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#414540]/75">
            Enterprise ERP Context
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#414540] tracking-tight">
            Why Invoice Exception Detection Matters
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#414540]/85 leading-relaxed">
            In SAP and enterprise ERP systems, the Accounts Payable (AP) department processes thousands of invoices
            daily. While modern ERPs enforce standard 3-way matching (comparing Purchase Order, Goods Receipt, and Vendor
            Invoice), manual auditing cannot scale to the volume. Uncaught exceptions result in millions in cash leakage,
            audit penalties, and payment fraud.
          </p>
        </div>

        {/* 5 Exception Classes Breakdown Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXCEPTION_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#e3dcd1] border border-[#b3b7b3] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#414540] text-[#e3dcd1] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#b3b7b3]/40 text-[#414540]">
                      {card.share}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#414540]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#414540]/80 leading-normal">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Value proposition card */}
          <div className="p-6 rounded-2xl bg-[#414540] text-[#e3dcd1] border border-[#414540] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#e3dcd1] text-[#414540] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#e3dcd1]">
                Continuous AI/ML Guardrails
              </h3>
              <p className="mt-2 text-sm text-[#e3dcd1]/85 leading-normal">
                By combining statistical tolerance heuristics with anomaly detection models, enterprises automate 88%
                of clean straight-through processing while isolating the 12% high-risk exceptions for targeted human audit.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#b3b7b3]/30 flex items-center justify-between text-xs text-[#e3dcd1]/70">
              <span>Zero-leakage objective</span>
              <span>Sub-5ms inference</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
