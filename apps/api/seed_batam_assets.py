import sys
import os
import random
from datetime import date, timedelta

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.db.session import SessionLocal
from src.models.location import Site, Building, Floor, Room, Rack
from src.models.asset import Asset, AssetCategory

def seed_assets():
    db = SessionLocal()
    
    # 1. Ensure categories exist
    categories = ["Server", "Switch", "Router", "Storage", "PDU"]
    cat_map = {}
    for c_name in categories:
        cat = db.query(AssetCategory).filter(AssetCategory.name == c_name).first()
        if not cat:
            cat = AssetCategory(name=c_name, description=f"{c_name} Category")
            db.add(cat)
            db.commit()
            db.refresh(cat)
        cat_map[c_name] = cat.id

    # 2. Get the new racks from Floor 3 and Floor 4 in Batam DC
    racks = db.query(Rack).filter(Rack.name.like("RACK-F3-%") | Rack.name.like("RACK-F4-%")).all()
    
    if not racks:
        print("No racks found. Please run seed_batam_racks.py first.")
        return

    print(f"Found {len(racks)} racks. Generating assets...")

    vendors = [
        ("Dell", "PowerEdge R740"),
        ("Dell", "PowerEdge R640"),
        ("HP", "ProLiant DL380 Gen10"),
        ("HP", "ProLiant DL360 Gen10"),
        ("Cisco", "UCS C220 M5"),
        ("Cisco", "Catalyst 9300"), # Switch
        ("Cisco", "Nexus 9300"),    # Switch
        ("NetApp", "AFF A400"),     # Storage
        ("APC", "Metered Rack PDU") # PDU
    ]

    statuses = ["Active", "Active", "Active", "Active", "Maintenance", "Offline"]
    
    today = date.today()
    assets_to_create = []
    asset_counter = 1

    for rack in racks:
        # Put 5 to 15 assets per rack
        num_assets = random.randint(5, 15)
        used_u = set()
        
        for _ in range(num_assets):
            # Find an empty U position
            u_pos = random.randint(1, 42)
            while u_pos in used_u:
                u_pos = random.randint(1, 42)
            used_u.add(u_pos)
            
            vendor, model = random.choice(vendors)
            
            # Determine category based on model
            if "Catalyst" in model or "Nexus" in model:
                cat_id = cat_map["Switch"]
            elif "NetApp" in model:
                cat_id = cat_map["Storage"]
            elif "APC" in model:
                cat_id = cat_map["PDU"]
            else:
                cat_id = cat_map["Server"]
                
            status = random.choice(statuses)
            
            purchase_date = today - timedelta(days=random.randint(100, 1500))
            warranty_end = purchase_date + timedelta(days=365*3) # 3 years warranty
            
            asset_tag = f"AST-BTM-{str(asset_counter).zfill(6)}"
            hostname = f"btm-{vendor[:3].lower()}-{str(asset_counter).zfill(4)}.audira.local"
            serial = f"SN-{random.randint(1000000, 9999999)}"
            
            a = Asset(
                asset_tag=asset_tag,
                hostname=hostname,
                serial_number=serial,
                manufacturer=vendor,
                model=model,
                status=status,
                purchase_date=purchase_date,
                warranty_end=warranty_end,
                category_id=cat_id,
                rack_id=rack.id,
                u_position=u_pos
            )
            assets_to_create.append(a)
            asset_counter += 1

    # Bulk insert for speed
    print(f"Inserting {len(assets_to_create)} assets into the database...")
    db.add_all(assets_to_create)
    db.commit()
    print("Assets successfully generated and inserted!")

if __name__ == "__main__":
    seed_assets()
