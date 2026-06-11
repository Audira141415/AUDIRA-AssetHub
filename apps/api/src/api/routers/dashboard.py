from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy import func
from src.api.deps import SessionDep, CurrentUser
from src.models.asset import Asset

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: SessionDep, current_user: CurrentUser) -> Any:
    total_assets = db.query(Asset).count()
    active_assets = db.query(Asset).filter(Asset.status == "Active").count()
    retired_assets = db.query(Asset).filter(Asset.status == "Retired").count()
    
    # Mocking charts data until full queries are written
    asset_growth = [
        {"month": "Jan", "assets": 120},
        {"month": "Feb", "assets": 132},
        {"month": "Mar", "assets": 141},
        {"month": "Apr", "assets": 156},
        {"month": "May", "assets": 168},
    ]
    
    distribution = [
        {"name": "Server", "value": 400},
        {"name": "Switch", "value": 300},
        {"name": "Router", "value": 300},
        {"name": "Storage", "value": 200},
    ]
    
    return {
        "widgets": {
            "total_assets": total_assets,
            "active_assets": active_assets,
            "retired_assets": retired_assets,
            "expired_warranty": 12, # mock
            "rack_utilization": "68%" # mock
        },
        "charts": {
            "asset_growth": asset_growth,
            "distribution": distribution
        }
    }
