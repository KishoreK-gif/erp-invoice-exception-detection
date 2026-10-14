import React from 'react';
import { Mail, ShieldAlert, Heart, Terminal, Code2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-12 border-t border-[#b3b7b3]/60 bg-[#e3dcd1] text-[#414540]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Col 1: Brand & Overview */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-[#414540] text-[#e3dcd1] flex items-center justify-center">
                                <ShieldAlert className="w-4 h-4" />
                            </div>
                            <span className="font-extrabold text-base tracking-tight text-[#414540]">
                                Invoice Exception Detection
                            </span>
                        </div>
                        <p className="text-xs text-[#414540]/80 max-w-md leading-relaxed">
                            An AI/ML benchmark showcasing automated enterprise accounts-payable exception detection,
                            simulating SAP ERP workflows, 3-way matching, and fraud protection heuristics.
                        </p>
                        <div className="mt-4 flex items-center space-x-2 text-[11px] text-[#414540]/70 font-mono">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>FastAPI Backend • React 19 • Tailwind CSS • TanStack Table • Recharts</span>
                        </div>
                    </div>

                    {/* Col 2: Navigation */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#414540] mb-3">
                            Project Navigation
                        </h4>
                        <ul className="space-y-2 text-xs text-[#414540]/80">
                            <li>
                                <a href="#problem" className="hover:text-[#414540] font-medium transition-colors">
                                    Why Exceptions Matter
                                </a>
                            </li>
                            <li>
                                <a href="#analytics" className="hover:text-[#414540] font-medium transition-colors">
                                    Anomaly Stats & Charts
                                </a>
                            </li>
                            <li>
                                <a href="#explorer" className="hover:text-[#414540] font-medium transition-colors">
                                    Interactive Data Explorer
                                </a>
                            </li>
                            <li>
                                <a href="#download" className="hover:text-[#414540] font-medium transition-colors">
                                    Download Dataset CSVs
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Contact & Links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#414540] mb-3">
                            Links & Contact
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            <li>
                                <a
                                    href="https://github.com/Kishorek001222"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center space-x-2 text-[#414540] hover:opacity-75 transition-opacity"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                    <span>GitHub Repository</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:kishorek3612@gmail.com"
                                    className="inline-flex items-center space-x-2 text-[#414540] hover:opacity-75 transition-opacity"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>kishorek3612@gmail.com</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="http://127.0.0.1:8000/docs"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-mono underline text-[#414540]/80 hover:text-[#414540]"
                                >
                                    Swagger OpenAPI Docs (/docs)
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-[#b3b7b3]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#414540]/70">
                    <p>© 2026 Invoice Exception Detection Project. Open for academic, research, and portfolio evaluation.</p>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-1">
                        <span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
