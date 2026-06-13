import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.db.session import SessionLocal
from src.models.location import Rack
from src.models.asset import Asset, AssetCategory

def seed_racks():
    db = SessionLocal()
    
    cat = db.query(AssetCategory).filter(AssetCategory.name == "Rack").first()
    if not cat:
        cat = AssetCategory(name="Rack", description="Physical Server Rack")
        db.add(cat)
        db.commit()
        db.refresh(cat)

    racks = db.query(Rack).filter(Rack.name.like("RACK-F3-%") | Rack.name.like("RACK-F4-%")).all()
    
    assets_to_create = []
    
    for rack in racks:
        # Check if asset already exists
        existing = db.query(Asset).filter(Asset.asset_tag == rack.name).first()
        if not existing:
            a = Asset(
                asset_tag=rack.name,
                hostname=f"rack-{rack.name.lower()}",
                serial_number=f"RACK-SN-{rack.id}",
                manufacturer="Vertiv",
                model="VR3100 42U",
                status="Active",
                category_id=cat.id,
                rack_id=None,  # The rack itself isn't in a rack
                u_position=None
            )
            assets_to_create.append(a)

    print(f"Inserting {len(assets_to_create)} racks as assets...")
    db.add_all(assets_to_create)
    db.commit()
    print("Done!")

if __name__ == "__main__":
    seed_racks()
