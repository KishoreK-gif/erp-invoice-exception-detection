"""Generate a reproducible synthetic invoice-exception dataset.

The script creates three inspectable CSV files:

* invoices.csv
* purchase_orders.csv
* vendors.csv

Invoices are generated as mostly clean records first.  Anomaly injection then
changes only the field(s) that define the selected exception type and records
the ground-truth label in ``is_exception`` and ``exception_type``.
"""

from __future__ import annotations

import argparse
from collections import Counter
from datetime import date, timedelta
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from faker import Faker


DEFAULT_SEED = 20260914
VENDOR_COUNT = 220
PURCHASE_ORDER_COUNT = 16_500
INVOICE_COUNT = 20_000
TARGET_EXCEPTION_RATE = 0.12
DATA_START_DATE = date(2024, 1, 1)
DATA_END_DATE = date(2025, 12, 31)

PAYMENT_TERMS = {"Net 30": 30, "Net 60": 60, "Net 90": 90}
EXCEPTION_WEIGHTS = {
    "amount_mismatch": 0.30,
    "duplicate_invoice": 0.25,
    "missing_invalid_po_reference": 0.20,
    "vendor_bank_detail_changed": 0.15,
    "date_anomaly": 0.10,
}


def make_unique_id(fake: Faker, prefix: str) -> str:
    """Use Faker's unique generator for reproducible human-readable IDs."""

    return f"{prefix}-{fake.unique.random_int(min=10_000_000, max=99_999_999)}"


def generate_vendors(fake: Faker, rng: np.random.Generator, count: int) -> list[dict[str, Any]]:
    """Create vendors with fixed bank details and vendor-specific amount ranges."""

    vendors: list[dict[str, Any]] = []
    seen_names: set[str] = set()

    for _ in range(count):
        name = fake.company()
        while name in seen_names:
            name = fake.company()
        seen_names.add(name)

        typical_average = float(rng.lognormal(mean=np.log(7_500), sigma=0.65))
        typical_min = max(250.0, typical_average * float(rng.uniform(0.45, 0.65)))
        typical_max = typical_average * float(rng.uniform(1.50, 2.40))

        vendors.append(
            {
                "vendor_id": f"V-{fake.unique.random_int(min=1_000, max=99_999):05d}",
                "vendor_name": name,
                "bank_account_number": fake.unique.numerify(text="################"),
                "typical_min_invoice_amount": round(typical_min, 2),
                "typical_max_invoice_amount": round(typical_max, 2),
                "typical_average_invoice_amount": round(typical_average, 2),
            }
        )

    return vendors


def generate_purchase_orders(
    fake: Faker,
    rng: np.random.Generator,
    vendors: list[dict[str, Any]],
    count: int,
) -> list[dict[str, Any]]:
    """Create purchase orders linked to the generated vendors."""

    purchase_orders: list[dict[str, Any]] = []
    for _ in range(count):
        vendor = vendors[int(rng.integers(0, len(vendors)))]
        po_date = fake.date_between(start_date=DATA_START_DATE, end_date=DATA_END_DATE)
        amount = float(
            rng.lognormal(mean=np.log(vendor["typical_average_invoice_amount"]), sigma=0.35)
        )
        amount = float(
            np.clip(
                amount,
                vendor["typical_min_invoice_amount"] * 0.35,
                vendor["typical_max_invoice_amount"] * 2.50,
            )
        )

        purchase_orders.append(
            {
                "po_number": make_unique_id(fake, "PO"),
                "vendor_id": vendor["vendor_id"],
                "po_amount": round(amount, 2),
                "po_date": po_date.isoformat(),
                "expected_delivery_date": (
                    po_date + timedelta(days=int(rng.integers(14, 91)))
                ).isoformat(),
            }
        )

    return purchase_orders


def generate_invoices(
    fake: Faker,
    rng: np.random.Generator,
    vendors: list[dict[str, Any]],
    purchase_orders: list[dict[str, Any]],
    count: int,
) -> list[dict[str, Any]]:
    """Create clean invoices with natural numeric and date variation."""

    vendors_by_id = {vendor["vendor_id"]: vendor for vendor in vendors}
    invoices: list[dict[str, Any]] = []

    for _ in range(count):
        po = purchase_orders[int(rng.integers(0, len(purchase_orders)))]
        vendor = vendors_by_id[po["vendor_id"]]
        po_date = date.fromisoformat(po["po_date"])
        invoice_date = po_date + timedelta(days=int(rng.integers(1, 31)))
        payment_terms = str(
            rng.choice(list(PAYMENT_TERMS), p=[0.70, 0.24, 0.06])
        )
        invoice_amount = float(po["po_amount"]) * float(rng.uniform(0.97, 1.03))
        invoice_amount = round(invoice_amount, 2)
        tax_rate = float(rng.choice([0.05, 0.12, 0.18], p=[0.15, 0.55, 0.30]))

        invoices.append(
            {
                "invoice_id": make_unique_id(fake, "INV"),
                "vendor_id": vendor["vendor_id"],
                "vendor_name": vendor["vendor_name"],
                "po_number": po["po_number"],
                "invoice_amount": invoice_amount,
                "tax_amount": round(invoice_amount * tax_rate, 2),
                "quantity": int(np.clip(np.round(rng.lognormal(np.log(8), 0.70)), 1, 100)),
                "invoice_date": invoice_date.isoformat(),
                "due_date": (invoice_date + timedelta(days=PAYMENT_TERMS[payment_terms])).isoformat(),
                "bank_account_number": vendor["bank_account_number"],
                "payment_terms": payment_terms,
                "is_exception": 0,
                "exception_type": "none",
            }
        )

    return invoices


def exception_counts(total_records: int) -> dict[str, int]:
    """Return a deliberately imbalanced but exact exception allocation."""

    total_exceptions = int(round(total_records * TARGET_EXCEPTION_RATE))
    counts = {
        exception_type: int(round(total_exceptions * weight))
        for exception_type, weight in EXCEPTION_WEIGHTS.items()
    }
    difference = total_exceptions - sum(counts.values())
    counts["amount_mismatch"] += difference
    return counts


def mark_exception(row: dict[str, Any], exception_type: str) -> None:
    row["is_exception"] = 1
    row["exception_type"] = exception_type


def inject_anomalies(
    fake: Faker,
    rng: np.random.Generator,
    invoices: list[dict[str, Any]],
    vendors: list[dict[str, Any]],
    purchase_orders: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Inject mutually exclusive anomalies while preserving clean labels."""

    invoices_by_index = invoices
    vendors_by_id = {vendor["vendor_id"]: vendor for vendor in vendors}
    purchase_orders_by_number = {po["po_number"]: po for po in purchase_orders}
    counts = exception_counts(len(invoices))
    shuffled_indices = rng.permutation(len(invoices)).tolist()

    assigned: dict[str, list[int]] = {}
    cursor = 0
    for exception_type, count in counts.items():
        assigned[exception_type] = shuffled_indices[cursor : cursor + count]
        cursor += count

    normal_indices = shuffled_indices[cursor:]

    # Amount mismatches: all linked POs remain valid, but the amount moves
    # beyond 5%, with a mix of borderline and obvious cases.
    for index in assigned["amount_mismatch"]:
        row = invoices_by_index[index]
        po = purchase_orders_by_number[row["po_number"]]
        original_amount = float(row["invoice_amount"])
        original_tax_rate = float(row["tax_amount"]) / max(original_amount, 0.01)
        borderline = bool(rng.random() < 0.45)
        if borderline:
            factor = float(rng.uniform(1.055, 1.10)) if rng.random() < 0.5 else float(rng.uniform(0.90, 0.945))
        else:
            factor = float(rng.uniform(1.15, 1.55)) if rng.random() < 0.5 else float(rng.uniform(0.45, 0.80))
        row["invoice_amount"] = round(float(po["po_amount"]) * factor, 2)
        # Tax is a derived field, so it changes consistently with the amount.
        row["tax_amount"] = round(float(row["invoice_amount"]) * original_tax_rate, 2)
        mark_exception(row, "amount_mismatch")

    # Duplicates are copies of clean rows with a new invoice ID.  Near-duplicate
    # cases vary amount by <=1.5% and date by only a few days.
    duplicate_sources = rng.choice(normal_indices, size=counts["duplicate_invoice"], replace=False)
    for index, source_index in zip(assigned["duplicate_invoice"], duplicate_sources):
        source = invoices_by_index[int(source_index)]
        row = invoices_by_index[index]
        for field in (
            "vendor_id",
            "vendor_name",
            "po_number",
            "invoice_amount",
            "tax_amount",
            "quantity",
            "invoice_date",
            "due_date",
            "bank_account_number",
            "payment_terms",
        ):
            row[field] = source[field]

        row["invoice_id"] = make_unique_id(fake, "INV")
        if rng.random() < 0.40:
            source_date = date.fromisoformat(source["invoice_date"])
            po_date = date.fromisoformat(purchase_orders_by_number[source["po_number"]]["po_date"])
            date_shift = int(rng.choice([-3, -2, -1, 1, 2, 3]))
            near_date = max(source_date + timedelta(days=date_shift), po_date + timedelta(days=1))
            amount_factor = float(rng.uniform(0.985, 1.015))
            row["invoice_date"] = near_date.isoformat()
            row["invoice_amount"] = round(float(source["invoice_amount"]) * amount_factor, 2)
            source_tax_rate = float(source["tax_amount"]) / max(float(source["invoice_amount"]), 0.01)
            row["tax_amount"] = round(float(row["invoice_amount"]) * source_tax_rate, 2)
            row["due_date"] = (
                near_date + timedelta(days=PAYMENT_TERMS[row["payment_terms"]])
            ).isoformat()
        mark_exception(row, "duplicate_invoice")

    # Invalid PO references deliberately use three variants: null, nonexistent,
    # and a real PO belonging to another vendor.
    for position, index in enumerate(assigned["missing_invalid_po_reference"]):
        row = invoices_by_index[index]
        mode = position % 3
        if mode == 0:
            row["po_number"] = None
        elif mode == 1:
            row["po_number"] = f"PO-INVALID-{fake.unique.random_int(min=1000, max=9999)}"
        else:
            other_po = purchase_orders[int(rng.integers(0, len(purchase_orders)))]
            while other_po["vendor_id"] == row["vendor_id"]:
                other_po = purchase_orders[int(rng.integers(0, len(purchase_orders)))]
            row["po_number"] = other_po["po_number"]
        mark_exception(row, "missing_invalid_po_reference")

    # Bank changes affect only the payment destination, while the vendor and PO
    # relationship stay clean.
    for index in assigned["vendor_bank_detail_changed"]:
        row = invoices_by_index[index]
        original_bank = vendors_by_id[row["vendor_id"]]["bank_account_number"]
        changed_bank = fake.numerify(text="################")
        while changed_bank == original_bank:
            changed_bank = fake.numerify(text="################")
        row["bank_account_number"] = changed_bank
        mark_exception(row, "vendor_bank_detail_changed")

    # Date anomalies use either an invoice date before its PO or an implausibly
    # distant due date.  The PO and payment terms remain otherwise valid.
    for position, index in enumerate(assigned["date_anomaly"]):
        row = invoices_by_index[index]
        po = purchase_orders_by_number[row["po_number"]]
        if position % 2 == 0:
            po_date = date.fromisoformat(po["po_date"])
            bad_invoice_date = po_date - timedelta(days=int(rng.integers(1, 61)))
            row["invoice_date"] = bad_invoice_date.isoformat()
            row["due_date"] = (
                bad_invoice_date + timedelta(days=PAYMENT_TERMS[row["payment_terms"]])
            ).isoformat()
        else:
            invoice_date = date.fromisoformat(row["invoice_date"])
            row["due_date"] = (
                invoice_date + timedelta(days=int(rng.integers(180, 421)))
            ).isoformat()
        mark_exception(row, "date_anomaly")

    return invoices_by_index


def validate_dataset(
    vendors: list[dict[str, Any]],
    purchase_orders: list[dict[str, Any]],
    invoices: list[dict[str, Any]],
) -> None:
    """Fail fast on broken keys, duplicate IDs, or an incorrect exception rate."""

    vendor_ids = {vendor["vendor_id"] for vendor in vendors}
    po_map = {po["po_number"]: po for po in purchase_orders}
    invoice_df = pd.DataFrame(invoices)
    invalid_po_type = "missing_invalid_po_reference"

    assert len(invoice_df) == INVOICE_COUNT, "Unexpected invoice row count"
    assert invoice_df["invoice_id"].is_unique, "Invoice IDs must be unique"
    assert len(vendor_ids) == len(vendors), "Vendor IDs must be unique"
    assert len(po_map) == len(purchase_orders), "PO numbers must be unique"
    assert set(invoice_df["vendor_id"]).issubset(vendor_ids), "Invoice vendor key is invalid"
    assert set(po["vendor_id"] for po in purchase_orders).issubset(vendor_ids), "PO vendor key is invalid"

    non_invalid_po_rows = invoice_df[invoice_df["exception_type"] != invalid_po_type]
    assert non_invalid_po_rows["po_number"].isin(po_map).all(), "Non-PO-reference rows must link to a PO"

    vendors_by_id = {vendor["vendor_id"]: vendor for vendor in vendors}
    clean_rows = invoice_df[invoice_df["is_exception"] == 0]
    clean_bank_matches = clean_rows.apply(
        lambda row: row["bank_account_number"] == vendors_by_id[row["vendor_id"]]["bank_account_number"],
        axis=1,
    )
    assert clean_bank_matches.all(), "Normal rows must use the vendor's fixed bank account"

    exception_rate = float(invoice_df["is_exception"].mean())
    assert 0.10 <= exception_rate <= 0.15, "Exception rate is outside the 10-15% target"


def print_summary(output_dir: Path, invoices: list[dict[str, Any]]) -> None:
    """Print the requested summary and an explicit target-rate check."""

    invoice_df = pd.DataFrame(invoices)
    exception_count = int(invoice_df["is_exception"].sum())
    exception_rate = exception_count / len(invoice_df)
    breakdown = Counter(
        invoice_df.loc[invoice_df["is_exception"] == 1, "exception_type"].tolist()
    )

    print(f"Output directory: {output_dir.resolve()}")
    print(f"Total records: {len(invoice_df):,}")
    print(f"Exceptions: {exception_count:,}")
    print(f"Overall exception rate: {exception_rate:.2%}")
    print(f"Within 10-15% target: {'yes' if 0.10 <= exception_rate <= 0.15 else 'no'}")
    print("Breakdown by exception_type:")
    for exception_type, count in breakdown.items():
        print(f"  {exception_type}: {count:,} ({count / len(invoice_df):.2%})")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).resolve().parent,
        help="Directory for invoices.csv, purchase_orders.csv, and vendors.csv.",
    )
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED, help="Random seed.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    fake = Faker("en_US")
    fake.seed_instance(args.seed)
    rng = np.random.default_rng(args.seed)

    vendors = generate_vendors(fake, rng, VENDOR_COUNT)
    purchase_orders = generate_purchase_orders(fake, rng, vendors, PURCHASE_ORDER_COUNT)
    invoices = generate_invoices(fake, rng, vendors, purchase_orders, INVOICE_COUNT)
    invoices = inject_anomalies(fake, rng, invoices, vendors, purchase_orders)
    validate_dataset(vendors, purchase_orders, invoices)

    pd.DataFrame(invoices).to_csv(args.output_dir / "invoices.csv", index=False, na_rep="", float_format="%.2f")
    pd.DataFrame(purchase_orders).to_csv(args.output_dir / "purchase_orders.csv", index=False, float_format="%.2f")
    pd.DataFrame(vendors).to_csv(args.output_dir / "vendors.csv", index=False, float_format="%.2f")

    print_summary(args.output_dir, invoices)


if __name__ == "__main__":
    main()
