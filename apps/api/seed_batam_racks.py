import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.db.session import SessionLocal
from src.models.location import Site, Building, Floor, Room, Rack

def seed():
    db = SessionLocal()
    
    # Get Batam DC
    site = db.query(Site).filter(Site.name == "Batam DC").first()
    if not site:
        print("Batam DC site not found. Creating it...")
        site = Site(name="Batam DC", address="Nongsa Digital Park, Batam")
        db.add(site)
        db.commit()
        db.refresh(site)

    # Get Main Building in Batam DC
    building = db.query(Building).filter(Building.site_id == site.id).first()
    if not building:
        print("Main Building not found in Batam DC. Creating it...")
        building = Building(name="Main Building", site_id=site.id)
        db.add(building)
        db.commit()
        db.refresh(building)

    # Create Floor 3 and Floor 4
    f3 = db.query(Floor).filter(Floor.name == "Floor 3", Floor.building_id == building.id).first()
    if not f3:
        f3 = Floor(name="Floor 3", building_id=building.id)
        db.add(f3)
        db.commit()
        db.refresh(f3)

    f4 = db.query(Floor).filter(Floor.name == "Floor 4", Floor.building_id == building.id).first()
    if not f4:
        f4 = Floor(name="Floor 4", building_id=building.id)
        db.add(f4)
        db.commit()
        db.refresh(f4)

    # Create large Data Halls for each floor
    r3 = db.query(Room).filter(Room.name == "Data Hall 3", Room.floor_id == f3.id).first()
    if not r3:
        r3 = Room(name="Data Hall 3", floor_id=f3.id)
        db.add(r3)
        db.commit()
        db.refresh(r3)

    r4 = db.query(Room).filter(Room.name == "Data Hall 4", Room.floor_id == f4.id).first()
    if not r4:
        r4 = Room(name="Data Hall 4", floor_id=f4.id)
        db.add(r4)
        db.commit()
        db.refresh(r4)

    # Generate 80 Racks for Floor 3
    print("Generating 80 racks for Floor 3...")
    for i in range(1, 81):
        rack_name = f"RACK-F3-{str(i).zfill(2)}"
        existing = db.query(Rack).filter(Rack.name == rack_name, Rack.room_id == r3.id).first()
        if not existing:
            r = Rack(name=rack_name, room_id=r3.id, height_u=42, power_capacity_kw=10.0)
            db.add(r)
    db.commit()

    # Generate 80 Racks for Floor 4
    print("Generating 80 racks for Floor 4...")
    for i in range(1, 81):
        rack_name = f"RACK-F4-{str(i).zfill(2)}"
        existing = db.query(Rack).filter(Rack.name == rack_name, Rack.room_id == r4.id).first()
        if not existing:
            r = Rack(name=rack_name, room_id=r4.id, height_u=42, power_capacity_kw=10.0)
            db.add(r)
    db.commit()

    print("Successfully generated 80 racks for Floor 3 and 80 racks for Floor 4 in Batam DC!")

if __name__ == "__main__":
    seed()
