import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';
import { fetchDatasetPreview } from '../api';

const EXCEPTION_BADGES = {
  amount_mismatch: {
    label: 'Amount Mismatch',
    bg: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  duplicate_invoice: {
    label: 'Duplicate Invoice',
    bg: 'bg-rose-100 text-rose-900 border-rose-300',
  },
  missing_invalid_po_reference: {
    label: 'Missing / Invalid PO',
    bg: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  vendor_bank_detail_changed: {
    label: 'Bank Changed',
    bg: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  date_anomaly: {
    label: 'Date Anomaly',
    bg: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  none: {
    label: 'Clean Match',
    bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
};

export default function DataExplorer() {
  // Query state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortBy, setSortBy] = useState('invoice_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [exceptionType, setExceptionType] = useState('all');
  const [vendorSearch, setVendorSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');

  // Data state
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDatasetPreview({
        page,
        pageSize,
        sortBy,
        sortOrder,
        exceptionType,
        vendorId: vendorSearch,
        dateFrom,
        dateTo,
        search,
      });
      setData(res.items || []);
      setTotal(res.total || 0);
      setFilteredTotal(res.filtered_total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      console.error(err);
      setError('Failed to query dataset from backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, sortBy, sortOrder, exceptionType]);

  const handleApplyFilter = (e) => {
    e?.preventDefault();
    setPage(1);
    loadData();
  };

  const handleResetFilters = () => {
    setExceptionType('all');
    setVendorSearch('');
    setDateFrom('');
    setDateTo('');
    setSearch('');
    setPage(1);
    setSortBy('invoice_date');
    setSortOrder('desc');
  };

  const handleSort = (columnId) => {
    if (sortBy === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnId);
      setSortOrder('desc');
    }
    setPage(1);
  };

  // TanStack columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'invoice_id',
        header: 'Invoice ID',
        cell: (info) => (
          <div>
            <span className="font-mono text-xs font-semibold text-[#414540]">
              {info.getValue()}
            </span>
            <div className="text-[11px] text-[#414540]/60">
              Terms: {info.row.original.payment_terms}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'invoice_date',
        header: 'Dates',
        cell: (info) => (
          <div className="text-xs">
            <div className="font-medium text-[#414540]">{info.getValue()}</div>
            <div className="text-[11px] text-[#414540]/60">Due: {info.row.original.due_date}</div>
          </div>
        ),
      },
      {
        accessorKey: 'vendor_name',
        header: 'Vendor Details',
        cell: (info) => (
          <div className="max-w-[200px]">
            <div className="font-bold text-xs text-[#414540] truncate" title={info.getValue()}>
              {info.getValue()}
            </div>
            <div className="text-[11px] font-mono text-[#414540]/65">
              {info.row.original.vendor_id}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'po_number',
        header: 'PO Reference',
        cell: (info) => {
          const poNum = info.getValue();
          const poAmt = info.row.original.po_amount;
          const invAmt = info.row.original.invoice_amount;
          const isMismatch = poAmt && Math.abs(poAmt - invAmt) > 0.05;

          return (
            <div className="text-xs font-mono">
              <span className="text-[#414540] font-medium">{poNum || '—'}</span>
              {poAmt && (
                <div className="text-[11px] text-[#414540]/70">
                  PO: ${poAmt.toLocaleString()}
                  {isMismatch && (
                    <span className="ml-1 text-[10px] text-amber-800 font-semibold bg-amber-100 px-1 rounded">
                      diff
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'invoice_amount',
        header: 'Amount',
        cell: (info) => (
          <div className="text-xs">
            <div className="font-bold text-[#414540]">
              ${Number(info.getValue()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-[#414540]/60">
              Tax: ${Number(info.row.original.tax_amount).toFixed(2)} (Qty: {info.row.original.quantity})
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'exception_type',
        header: 'Exception Status',
        cell: (info) => {
          const type = info.getValue();
          const isExc = info.row.original.is_exception === 1;
          const badge = EXCEPTION_BADGES[type] || {
            label: type,
            bg: 'bg-gray-100 text-gray-800 border-gray-300',
          };

          return (
            <div className="flex items-center space-x-1.5">
              {isExc ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              )}
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${badge.bg}`}
              >
                {badge.label}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
  });

  return (
    <section id="explorer" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="max-w-3xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#414540]/75">
          Live Interactive Explorer
        </span>
        <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#414540] tracking-tight">
          Explore Invoices & Anomaly Signals
        </h2>
        <p className="mt-2 text-base text-[#414540]/80">
          Search, sort, and filter through 20,000 synthetic SAP ERP accounts-payable records. Powered by
          TanStack Table v8 and server-side pandas pagination.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="p-6 rounded-3xl bg-[#b3b7b3]/30 border border-[#b3b7b3] mb-6 shadow-xs">
        <form onSubmit={handleApplyFilter} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414540]/80 mb-1.5">
                Search IDs / Vendor
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#414540]/60" />
                <input
                  type="text"
                  placeholder="e.g. INV-34387194 or Nelson"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#e3dcd1] border border-[#b3b7b3] text-[#414540] placeholder-[#414540]/50 focus:outline-none focus:ring-1 focus:ring-[#414540]"
                />
              </div>
            </div>

            {/* Exception Type Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414540]/80 mb-1.5">
                Exception Filter
              </label>
              <select
                value={exceptionType}
                onChange={(e) => {
                  setExceptionType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#e3dcd1] border border-[#b3b7b3] text-[#414540] focus:outline-none focus:ring-1 focus:ring-[#414540]"
              >
                <option value="all">All Invoices (Clean + Exceptions)</option>
                <option value="all_exceptions">Only Exceptions (2,400 Records)</option>
                <option value="clean">Only Clean Records (17,600 Records)</option>
                <option value="amount_mismatch">Amount Mismatch (30%)</option>
                <option value="duplicate_invoice">Duplicate Invoice (25%)</option>
                <option value="missing_invalid_po_reference">Missing / Invalid PO (20%)</option>
                <option value="vendor_bank_detail_changed">Bank Detail Changed (15%)</option>
                <option value="date_anomaly">Date Anomaly (10%)</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414540]/80 mb-1.5">
                Invoice Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#e3dcd1] border border-[#b3b7b3] text-[#414540] focus:outline-none focus:ring-1 focus:ring-[#414540]"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414540]/80 mb-1.5">
                Invoice Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#e3dcd1] border border-[#b3b7b3] text-[#414540] focus:outline-none focus:ring-1 focus:ring-[#414540]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#b3b7b3]/40">
            <div className="text-xs text-[#414540]/80 font-medium">
              Showing <span className="font-bold">{filteredTotal.toLocaleString()}</span> of{' '}
              <span className="font-bold">{total.toLocaleString()}</span> invoices
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#414540] hover:bg-[#b3b7b3]/40 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#414540] text-[#e3dcd1] text-xs font-semibold hover:bg-[#414540]/90 transition-colors flex items-center space-x-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Data Table Card */}
      <div className="rounded-3xl bg-[#b3b7b3]/20 border border-[#b3b7b3] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-[#b3b7b3]/50 border-b border-[#b3b7b3]">
                  {headerGroup.headers.map((header) => {
                    const colId = header.column.id;
                    const isSorted = sortBy === colId;
                    return (
                      <th
                        key={header.id}
                        onClick={() => handleSort(colId)}
                        className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-[#414540] cursor-pointer hover:bg-[#b3b7b3]/70 transition-colors select-none"
                      >
                        <div className="flex items-center space-x-1.5">
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          {isSorted ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-[#414540]" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-[#414540]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-[#414540]/40" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#b3b7b3]/40 bg-[#e3dcd1]/70">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-[#414540]">
                    <div className="inline-flex items-center space-x-2 text-xs font-medium">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Fetching ERP invoice records...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={columns.length} className="py-10 text-center text-rose-800 text-xs font-medium">
                    {error}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-[#414540]/70 text-xs font-medium">
                    No matching invoices found for the selected filter criteria.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isExc = row.original.is_exception === 1;
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#b3b7b3]/30 transition-colors ${
                        isExc ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-3 px-4 align-top">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 bg-[#b3b7b3]/40 border-t border-[#b3b7b3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#414540]">
          {/* Page size dropdown */}
          <div className="flex items-center space-x-2">
            <span>Show rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 rounded-lg bg-[#e3dcd1] border border-[#b3b7b3] font-medium text-[#414540] focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-[#414540]/70">
              Page {page} of {totalPages} ({filteredTotal.toLocaleString()} filtered)
            </span>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-1.5 rounded-lg border border-[#b3b7b3] bg-[#e3dcd1] hover:bg-[#b3b7b3]/50 disabled:opacity-40 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded-lg border border-[#b3b7b3] bg-[#e3dcd1] hover:bg-[#b3b7b3]/50 disabled:opacity-40 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
