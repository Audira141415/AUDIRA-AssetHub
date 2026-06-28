import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.db.session import SessionLocal
from src.models.asset import Asset, AssetMovement
from src.models.location import Site, Building, Floor, Room, Rack

def factory_reset():
    db = SessionLocal()
    try:
        print("Starting factory reset. Deleting mock data...")
        
        # 1. Delete Asset Movements
        movements = db.query(AssetMovement).all()
        print(f"Deleting {len(movements)} asset movements...")
        for m in movements:
            db.delete(m)
            
        # 2. Delete Assets
        assets = db.query(Asset).all()
        print(f"Deleting {len(assets)} assets...")
        for a in assets:
            db.delete(a)
            
        # 3. Delete Racks
        racks = db.query(Rack).all()
        print(f"Deleting {len(racks)} racks...")
        for r in racks:
            db.delete(r)
            
        # 4. Delete Rooms
        rooms = db.query(Room).all()
        print(f"Deleting {len(rooms)} rooms...")
        for r in rooms:
            db.delete(r)
            
        # 5. Delete Floors
        floors = db.query(Floor).all()
        print(f"Deleting {len(floors)} floors...")
        for f in floors:
            db.delete(f)
            
        # 6. Delete Buildings
        buildings = db.query(Building).all()
        print(f"Deleting {len(buildings)} buildings...")
        for b in buildings:
            db.delete(b)
            
        # 7. Delete Sites
        sites = db.query(Site).all()
        print(f"Deleting {len(sites)} sites...")
        for s in sites:
            db.delete(s)
            
        db.commit()
        print("Factory reset completed successfully. Database is now clean.")
        
    except Exception as e:
        db.rollback()
        print(f"Error during factory reset: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    factory_reset()
