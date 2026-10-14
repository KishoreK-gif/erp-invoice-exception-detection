/**
 * API client module for interacting with the FastAPI backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/api/stats`);
  if (!res.ok) {
    throw new Error(`Failed to load stats: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchDatasetPreview({
  page = 1,
  pageSize = 15,
  sortBy = 'invoice_date',
  sortOrder = 'desc',
  exceptionType = '',
  vendorId = '',
  dateFrom = '',
  dateTo = '',
  search = '',
} = {}) {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('page_size', pageSize);
  params.append('sort_by', sortBy);
  params.append('sort_order', sortOrder);

  if (exceptionType && exceptionType !== 'all') {
    params.append('exception_type', exceptionType);
  }
  if (vendorId) {
    params.append('vendor_id', vendorId);
  }
  if (dateFrom) {
    params.append('date_from', dateFrom);
  }
  if (dateTo) {
    params.append('date_to', dateTo);
  }
  if (search) {
    params.append('search', search);
  }

  const res = await fetch(`${BASE_URL}/api/dataset/preview?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to load dataset preview: ${res.statusText}`);
  }
  return res.json();
}

export function getDownloadUrl(file = 'all') {
  return `${BASE_URL}/api/dataset/download?file=${encodeURIComponent(file)}`;
}
