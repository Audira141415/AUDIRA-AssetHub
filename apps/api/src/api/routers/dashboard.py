from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy import func
from src.api.deps import SessionDep, CurrentUser
from src.models.asset import Asset
from src.models.location import Site, Building, Floor, Room, Rack

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: SessionDep, current_user: CurrentUser) -> Any:
    total_assets = db.query(Asset).count()
    active_assets = db.query(Asset).filter(Asset.status == "Active").count()
    retired_assets = db.query(Asset).filter(Asset.status == "Retired").count()
    
    # Calculate location stats
    total_sites = db.query(Site).count()
    total_racks = db.query(Rack).count()
    
    # Calculate rack utilization roughly (assets with rack_id / total rack capacity)
    # This is a basic mock metric for rack_utilization based on DB presence
    racks_with_assets = db.query(Asset).filter(Asset.rack_id != None).distinct(Asset.rack_id).count()
    rack_utilization_pct = (racks_with_assets / total_racks * 100) if total_racks > 0 else 0
    
    # Mocking charts data until full history models exist
    asset_growth = [
        {"month": "Jan", "assets": 120},
        {"month": "Feb", "assets": 132},
        {"month": "Mar", "assets": 141},
        {"month": "Apr", "assets": 156},
        {"month": "May", "assets": total_assets if total_assets > 156 else 168},
    ]
    
    # Asset distribution by category mock (we could group by category_id if we want)
    # But for now let's just group by asset.model or manufacturer, or fallback to mock
    distribution = [
        {"name": "Server", "value": 400},
        {"name": "Switch", "value": 300},
        {"name": "Router", "value": 300},
        {"name": "Storage", "value": 200},
    ]
    
    # Locations
    sites = db.query(Site).all()
    locations_dist = []
    for s in sites:
        locations_dist.append({"name": s.name, "value": db.query(Building).filter(Building.site_id == s.id).count() * 10 + 50})
    
    if not locations_dist:
         locations_dist = [{"name": "Default DC", "value": 100}]

    return {
        "widgets": {
            "total_assets": total_assets,
            "active_assets": active_assets,
            "retired_assets": retired_assets,
            "expired_warranty": 12, # mock
            "rack_utilization": f"{int(rack_utilization_pct)}%" 
        },
        "charts": {
            "asset_growth": asset_growth,
            "distribution": distribution,
            "locations": locations_dist
        }
    }
