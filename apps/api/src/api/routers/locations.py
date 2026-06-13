from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.deps import SessionDep, CurrentUser
from src.models.location import Site, Building, Floor, Room, Rack
from src.models.asset import Asset
from src.schemas.location import Site as SiteSchema, SiteCreate, Building as BuildingSchema, BuildingCreate, Floor as FloorSchema, FloorCreate, Room as RoomSchema, RoomCreate, Rack as RackSchema, RackCreate, RackVisualization

router = APIRouter()

@router.get("/sites", response_model=List[SiteSchema])
def read_sites(db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    return db.query(Site).offset(skip).limit(limit).all()

@router.post("/sites", response_model=SiteSchema)
def create_site(site_in: SiteCreate, db: SessionDep, current_user: CurrentUser) -> Any:
    site = Site(**site_in.model_dump())
    db.add(site)
    db.commit()
    db.refresh(site)
    return site

@router.get("/buildings", response_model=List[BuildingSchema])
def read_buildings(db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    return db.query(Building).offset(skip).limit(limit).all()

@router.get("/floors", response_model=List[FloorSchema])
def read_floors(db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    return db.query(Floor).offset(skip).limit(limit).all()

@router.get("/rooms", response_model=List[RoomSchema])
def read_rooms(db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    return db.query(Room).offset(skip).limit(limit).all()

@router.get("/racks", response_model=List[RackSchema])
def read_racks(db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    return db.query(Rack).offset(skip).limit(limit).all()

@router.post("/racks", response_model=RackSchema)
def create_rack(rack_in: RackCreate, db: SessionDep, current_user: CurrentUser) -> Any:
    rack = Rack(**rack_in.model_dump())
    db.add(rack)
    db.commit()
    db.refresh(rack)
    return rack

@router.get("/racks/{rack_id}/visualization", response_model=RackVisualization)
def get_rack_visualization(rack_id: int, db: SessionDep, current_user: CurrentUser) -> Any:
    rack = db.query(Rack).filter(Rack.id == rack_id).first()
    if not rack:
        raise HTTPException(status_code=404, detail="Rack not found")
    
    assets = db.query(Asset).filter(Asset.rack_id == rack_id).all()
    # Simple utilization calculation assuming 1U per asset for now. 
    # In reality, assets might have heights.
    occupied_u = len([a for a in assets if a.u_position is not None])
    utilization = (occupied_u / rack.height_u) * 100 if rack.height_u else 0
    
    return {
        **rack.__dict__,
        "assets": assets,
        "utilization_percentage": round(utilization, 2)
    }
