"""Pydantic data models for Invoice Exception Detection API."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class InvoiceRecord(BaseModel):
    invoice_id: str
    vendor_id: str
    vendor_name: str
    po_number: str
    invoice_amount: float
    tax_amount: float
    quantity: int
    invoice_date: str
    due_date: str
    bank_account_number: str
    payment_terms: str
    is_exception: int
    exception_type: str
    po_amount: Optional[float] = None


class DatasetPreviewResponse(BaseModel):
    items: List[InvoiceRecord]
    total: int
    filtered_total: int
    page: int
    page_size: int
    total_pages: int


class ExceptionTypeStat(BaseModel):
    type: str
    label: str
    count: int
    percentage: float
    total_amount: float
    description: str


class MonthlyTrend(BaseModel):
    month: str
    total_invoices: int
    exceptions: int
    exception_rate: float


class VendorRiskStat(BaseModel):
    vendor_id: str
    vendor_name: str
    total_invoices: int
    exceptions: int
    exception_rate: float
    flagged_amount: float


class StatsResponse(BaseModel):
    total_records: int
    clean_records: int
    exception_records: int
    exception_rate: float
    total_spend: float
    flagged_spend: float
    exception_breakdown: List[ExceptionTypeStat]
    monthly_trend: List[MonthlyTrend]
    top_risk_vendors: List[VendorRiskStat]
    model_metrics: Dict[str, Any]
