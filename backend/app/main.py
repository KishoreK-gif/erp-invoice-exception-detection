"""Main FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import router

app = FastAPI(
    title="Invoice Exception Detection API",
    description="Backend service providing exploratory query filters, ERP anomaly statistics, and data downloads.",
    version="1.0.0",
)

# Configure CORS so React frontend on any development port can interact with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/", tags=["Health"])
def root_status():
    return {
        "service": "Invoice Exception Detection API",
        "status": "operational",
        "version": "1.0.0",
        "docs_url": "/docs",
        "endpoints": [
            "/api/dataset/preview",
            "/api/stats",
            "/api/dataset/download",
        ],
    }
