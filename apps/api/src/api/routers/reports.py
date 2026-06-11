import io
import csv
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from src.api.deps import SessionDep, CurrentUser
from src.models.asset import Asset, AssetMovement

router = APIRouter()

@router.get("/assets/csv")
def export_assets_csv(db: SessionDep, current_user: CurrentUser):
    assets = db.query(Asset).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "ID", "Asset Tag", "Hostname", "Serial Number", 
        "Manufacturer", "Model", "Status", "Purchase Date", 
        "Warranty Start", "Warranty End", "Rack ID", "U Position"
    ])
    
    # Write rows
    for asset in assets:
        writer.writerow([
            asset.id,
            asset.asset_tag,
            asset.hostname,
            asset.serial_number,
            asset.manufacturer,
            asset.model,
            asset.status,
            asset.purchase_date,
            asset.warranty_start,
            asset.warranty_end,
            asset.rack_id,
            asset.u_position
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=assets_inventory.csv"}
    )

@router.get("/movements/csv")
def export_movements_csv(db: SessionDep, current_user: CurrentUser):
    movements = db.query(AssetMovement).order_by(AssetMovement.timestamp.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Log ID", "Asset ID", "User ID", "Previous Rack ID", 
        "New Rack ID", "Action", "Notes", "Timestamp"
    ])
    
    # Write rows
    for mv in movements:
        writer.writerow([
            mv.id,
            mv.asset_id,
            mv.user_id,
            mv.previous_rack_id,
            mv.new_rack_id,
            mv.action,
            mv.notes,
            mv.timestamp
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=asset_movements.csv"}
    )
