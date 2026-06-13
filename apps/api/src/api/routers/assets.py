from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
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

import csv
import io

@router.post("/import")
def import_assets(db: SessionDep, current_user: CurrentUser, file: UploadFile = File(...)) -> Any:
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file format. Only CSV is allowed.")
    
    content = file.file.read().decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(content))
    
    imported_count = 0
    errors = []
    
    for row_num, row in enumerate(csv_reader, start=2):
        try:
            # Requires at least asset_tag and hostname
            if not row.get('asset_tag'):
                errors.append(f"Row {row_num}: Missing asset_tag")
                continue
                
            asset = Asset(
                asset_tag=row.get('asset_tag'),
                hostname=row.get('hostname'),
                serial_number=row.get('serial_number'),
                manufacturer=row.get('manufacturer'),
                model=row.get('model'),
                status=row.get('status', 'Active')
            )
            db.add(asset)
            imported_count += 1
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
            
    db.commit()
    return {"message": f"Successfully imported {imported_count} assets", "errors": errors}

@router.get("/export")
def export_assets(db: SessionDep, current_user: CurrentUser) -> Any:
    assets = db.query(Asset).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow(['ID', 'Asset Tag', 'Hostname', 'Serial Number', 'Manufacturer', 'Model', 'Status', 'Purchase Date', 'Warranty End'])
    
    for asset in assets:
        writer.writerow([
            asset.id, 
            asset.asset_tag, 
            asset.hostname, 
            asset.serial_number, 
            asset.manufacturer, 
            asset.model, 
            asset.status,
            asset.purchase_date.isoformat() if asset.purchase_date else "",
            asset.warranty_end.isoformat() if asset.warranty_end else ""
        ])
        
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]), 
        media_type="text/csv", 
        headers={"Content-Disposition": "attachment; filename=assets_export.csv"}
    )


from datetime import date, timedelta
@router.get("/warranty-report", response_model=List[AssetSchema])
def get_warranty_report(db: SessionDep, current_user: CurrentUser, days_threshold: int = 90) -> Any:
    today = date.today()
    threshold_date = today + timedelta(days=days_threshold)
    
    return db.query(Asset).filter(
        Asset.warranty_end != None,
        Asset.warranty_end <= threshold_date
    ).order_by(Asset.warranty_end.asc()).all()

@router.get("/{tag_or_id}", response_model=AssetSchema)
def get_asset(tag_or_id: str, db: SessionDep, current_user: CurrentUser) -> Any:
    # Try by ID first if it's a digit, else by asset_tag
    if tag_or_id.isdigit():
        asset = db.query(Asset).filter(Asset.id == int(tag_or_id)).first()
    else:
        asset = db.query(Asset).filter(Asset.asset_tag == tag_or_id).first()
        
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@router.put("/{id}", response_model=AssetSchema)
def update_asset(id: int, asset_in: AssetCreate, db: SessionDep, current_user: CurrentUser) -> Any:
    asset = db.query(Asset).filter(Asset.id == id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    update_data = asset_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(asset, field, value)
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset

@router.delete("/{id}")
def delete_asset(id: int, db: SessionDep, current_user: CurrentUser) -> Any:
    asset = db.query(Asset).filter(Asset.id == id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    db.delete(asset)
    db.commit()
    return {"message": "Asset deleted successfully"}

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
