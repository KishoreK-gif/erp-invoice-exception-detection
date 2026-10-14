"""Configuration settings for Invoice Exception Detection API."""
from pathlib import Path

# Base directories
APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
DATA_DIR = BACKEND_DIR / "data"

# Fallback dataset directory in case data/ was not populated
FALLBACK_DATASET_DIR = BACKEND_DIR.parent / "DATASETS"

INVOICES_CSV = DATA_DIR / "invoices.csv"
PURCHASE_ORDERS_CSV = DATA_DIR / "purchase_orders.csv"
VENDORS_CSV = DATA_DIR / "vendors.csv"

# If data/ doesn't have the files, fallback
if not INVOICES_CSV.exists() and (FALLBACK_DATASET_DIR / "invoices.csv").exists():
    INVOICES_CSV = FALLBACK_DATASET_DIR / "invoices.csv"
    PURCHASE_ORDERS_CSV = FALLBACK_DATASET_DIR / "purchase_orders.csv"
    VENDORS_CSV = FALLBACK_DATASET_DIR / "vendors.csv"
