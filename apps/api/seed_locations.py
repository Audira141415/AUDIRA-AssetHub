import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.db.session import SessionLocal
from src.models.location import Site, Building, Floor, Room, Rack

def seed():
    db = SessionLocal()
    
    # Check if we should seed more
    # if db.query(Site).count() > 0:
    #     print("Locations already seeded.")
    #     return

    # Create Sites
    site1 = Site(name="Batam DC", address="Nongsa Digital Park, Batam")
    site2 = Site(name="Jakarta DC", address="Kuningan, Jakarta")
    db.add_all([site1, site2])
    db.commit()

    # Create Buildings
    b1 = Building(name="Main Building", site_id=site1.id)
    b2 = Building(name="Tower A", site_id=site2.id)
    db.add_all([b1, b2])
    db.commit()

    # Create Floors
    f1 = Floor(name="Floor 1", building_id=b1.id)
    f2 = Floor(name="Floor 2", building_id=b1.id)
    f3 = Floor(name="Ground Floor", building_id=b2.id)
    db.add_all([f1, f2, f3])
    db.commit()

    # Create Rooms
    r1 = Room(name="Server Room A", floor_id=f1.id)
    r2 = Room(name="Server Room B", floor_id=f1.id)
    r3 = Room(name="Network Room", floor_id=f2.id)
    r4 = Room(name="Colocation 1", floor_id=f3.id)
    db.add_all([r1, r2, r3, r4])
    db.commit()

    # Create Racks
    racks = [
        Rack(name="RACK-01", room_id=r1.id, height_u=42),
        Rack(name="RACK-02", room_id=r1.id, height_u=42),
        Rack(name="RACK-03", room_id=r1.id, height_u=42),
        Rack(name="RACK-04", room_id=r2.id, height_u=42),
        Rack(name="NET-01", room_id=r3.id, height_u=42),
        Rack(name="COLO-01", room_id=r4.id, height_u=42),
    ]
    db.add_all(racks)
    db.commit()
    
    print("Seeded locations successfully!")

if __name__ == "__main__":
    seed()
