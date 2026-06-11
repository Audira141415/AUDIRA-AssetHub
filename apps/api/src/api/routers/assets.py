from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.deps import SessionDep, CurrentUser
from src.models.asset import Asset, AssetCategory, AssetMovement
from src.schemas.asset import Asset as AssetSchema, AssetCreate, AssetCategory as CategorySchema, AssetCategoryCreate, AssetMovementCreate, AssetMovementResponse

router = APIRouter()

@router.get("/categories", response_model=List[CategorySchema])
def read_categories(db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    return db.query(AssetCategory).offset(skip).limit(limit).all()

@router.post("/categories", response_model=CategorySchema)
def create_category(category_in: AssetCategoryCreate, db: SessionDep, current_user: CurrentUser) -> Any:
    category = AssetCategory(**category_in.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.get("/", response_model=List[AssetSchema])
def read_assets(db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    return db.query(Asset).offset(skip).limit(limit).all()

@router.post("/", response_model=AssetSchema)
def create_asset(asset_in: AssetCreate, db: SessionDep, current_user: CurrentUser) -> Any:
    asset = Asset(**asset_in.model_dump())
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset

from datetime import date, timedelta
@router.get("/warranty-report", response_model=List[AssetSchema])
def get_warranty_report(db: SessionDep, current_user: CurrentUser, days_threshold: int = 90) -> Any:
    today = date.today()
    threshold_date = today + timedelta(days=days_threshold)
    
    return db.query(Asset).filter(
        Asset.warranty_end != None,
        Asset.warranty_end <= threshold_date
    ).order_by(Asset.warranty_end.asc()).all()

@router.get("/{id}", response_model=AssetSchema)
def get_asset(id: int, db: SessionDep, current_user: CurrentUser) -> Any:
    asset = db.query(Asset).filter(Asset.id == id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@router.post("/{id}/move", response_model=AssetMovementResponse)
def move_asset(id: int, movement_in: AssetMovementCreate, db: SessionDep, current_user: CurrentUser) -> Any:
    asset = db.query(Asset).filter(Asset.id == id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    movement = AssetMovement(
        asset_id=asset.id,
        user_id=current_user.id,
        previous_rack_id=asset.rack_id,
        new_rack_id=movement_in.new_rack_id,
        action=movement_in.action,
        notes=movement_in.notes
    )
    
    # Update asset
    asset.rack_id = movement_in.new_rack_id
    asset.u_position = movement_in.new_u_position
    
    db.add(movement)
    db.commit()
    db.refresh(movement)
    return movement

@router.get("/{id}/history", response_model=List[AssetMovementResponse])
def get_asset_history(id: int, db: SessionDep, current_user: CurrentUser) -> Any:
    return db.query(AssetMovement).filter(AssetMovement.asset_id == id).order_by(AssetMovement.timestamp.desc()).all()
