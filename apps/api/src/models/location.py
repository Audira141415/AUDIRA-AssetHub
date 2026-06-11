from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from src.db.base import Base

class Site(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    address = Column(String, nullable=True)
    
    buildings = relationship("Building", back_populates="site")

class Building(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    site_id = Column(Integer, ForeignKey("site.id"))
    
    site = relationship("Site", back_populates="buildings")
    floors = relationship("Floor", back_populates="building")

class Floor(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    building_id = Column(Integer, ForeignKey("building.id"))
    
    building = relationship("Building", back_populates="floors")
    rooms = relationship("Room", back_populates="floor")

class Room(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    floor_id = Column(Integer, ForeignKey("floor.id"))
    
    floor = relationship("Floor", back_populates="rooms")
    racks = relationship("Rack", back_populates="room")

class Rack(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    room_id = Column(Integer, ForeignKey("room.id"))
    height_u = Column(Integer, default=42) # standard 42U rack
    width_mm = Column(Float, nullable=True)
    depth_mm = Column(Float, nullable=True)
    power_capacity_kw = Column(Float, nullable=True)
    
    room = relationship("Room", back_populates="racks")
    assets = relationship("Asset", back_populates="rack")
