"""FastAPI router defining dataset and stats endpoints."""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from .schemas import DatasetPreviewResponse, StatsResponse
from .services import DataService

router = APIRouter(prefix="/api")


@router.get("/dataset/preview", response_model=DatasetPreviewResponse, summary="Paginated invoice explorer")
def get_dataset_preview(
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=15, ge=1, le=100, description="Items per page"),
    sort_by: str = Query(default="invoice_date", description="Sort field name"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$", description="Sort direction"),
    exception_type: Optional[str] = Query(default=None, description="Exception filter: all, clean, all_exceptions, or specific exception_type"),
    vendor_id: Optional[str] = Query(default=None, description="Vendor ID or partial name filter"),
    date_from: Optional[str] = Query(default=None, description="Start date filter (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(default=None, description="End date filter (YYYY-MM-DD)"),
    search: Optional[str] = Query(default=None, description="General search across IDs and names"),
):
    service = DataService.get_instance()
    return service.get_preview(
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        exception_type=exception_type,
        vendor_id=vendor_id,
        date_from=date_from,
        date_to=date_to,
        search=search,
    )


@router.get("/stats", response_model=StatsResponse, summary="Aggregate exception metrics and distributions")
def get_stats():
    service = DataService.get_instance()
    return service.get_stats()


@router.get("/dataset/download", summary="Download raw CSV datasets or full zip bundle")
def download_dataset(
    file: Optional[str] = Query(
        default="all",
        description="Dataset to download: 'all' (zip bundle), 'invoices', 'purchase_orders', or 'vendors'",
    )
):
    service = DataService.get_instance()
    target = (file or "all").lower().strip()

    if target in ["all", "bundle", "zip"]:
        zip_path = service.create_bundle_zip()
        if not zip_path.exists():
            raise HTTPException(status_code=500, detail="Failed to create dataset archive")
        return FileResponse(
            path=str(zip_path),
            filename="erp_invoice_dataset_bundle.zip",
            media_type="application/zip",
        )

    file_tuple = service.get_file_path(target)
    if not file_tuple:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file requested: '{file}'. Valid options are 'all', 'invoices', 'purchase_orders', 'vendors'.",
        )

    filepath, filename = file_tuple
    if not filepath.exists():
        raise HTTPException(status_code=404, detail=f"File {filename} not found on server")

    return FileResponse(
        path=str(filepath),
        filename=filename,
        media_type="text/csv",
    )
