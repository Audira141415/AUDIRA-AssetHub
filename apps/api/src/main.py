from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routers import auth, locations, assets, dashboard, qr, reports, users, ai

app = FastAPI(
    title="Audira AssetHub API",
    description="Enterprise-grade Data Center Asset Management API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
def health_check():
    return {
        "success": True,
        "data": {
            "status": "healthy"
        },
        "message": "API is running"
    }

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(locations.router, prefix="/api/v1/locations", tags=["locations"])
app.include_router(assets.router, prefix="/api/v1/assets", tags=["assets"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(qr.router, prefix="/api/v1/qr", tags=["qr"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])
