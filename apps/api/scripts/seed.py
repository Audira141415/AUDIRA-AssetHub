import os
import sys
import asyncio
from datetime import date, timedelta
import random

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.db.session import SessionLocal
from src.models.user import User
from src.models.role import Role
from src.models.location import Site, Building, Floor, Room, Rack
from src.models.asset import AssetCategory, Asset
from src.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    
    # 1. Roles & Admin
    admin_role = db.query(Role).filter_by(name="Super Admin").first()
    if not admin_role:
        admin_role = Role(name="Super Admin", description="Full access")
        db.add(admin_role)
        db.commit()
        db.refresh(admin_role)

    admin_user = db.query(User).filter_by(email="admin@audira.local").first()
    if not admin_user:
        admin_user = User(
            email="admin@audira.local",
            hashed_password=get_password_hash("admin123"),
            full_name="System Admin",
            role_id=admin_role.id
        )
        db.add(admin_user)
        db.commit()

    # 2. Locations
    site = db.query(Site).filter_by(name="Batam DC").first()
    if not site:
        site = Site(name="Batam DC", address="Batam, Indonesia")
        db.add(site)
        db.commit()
        db.refresh(site)
        
        building = Building(name="Building A", site_id=site.id)
        db.add(building)
        db.commit()
        db.refresh(building)
        
        floor = Floor(name="Floor 1", building_id=building.id)
        db.add(floor)
        db.commit()
        db.refresh(floor)
        
        room = Room(name="Server Room", floor_id=floor.id)
        db.add(room)
        db.commit()
        db.refresh(room)
        
        rack = Rack(name="Rack R01", room_id=room.id, height_u=42)
        db.add(rack)
        db.commit()
        db.refresh(rack)

    # 3. Assets
    category = db.query(AssetCategory).filter_by(name="Server").first()
    if not category:
        category = AssetCategory(name="Server", description="Compute Servers")
        db.add(category)
        db.commit()
        db.refresh(category)

    asset = db.query(Asset).filter_by(asset_tag="SRV-001").first()
    if not asset:
        asset = Asset(
            asset_tag="SRV-001",
            hostname="web-node-01",
            serial_number="SN-12345",
            manufacturer="Dell",
            model="PowerEdge R740",
            category_id=category.id,
            rack_id=rack.id if 'rack' in locals() else None,
            u_position=10,
            status="Active",
            purchase_date=date.today() - timedelta(days=365),
            warranty_end=date.today() + timedelta(days=365)
        )
        db.add(asset)
        db.commit()
        
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
