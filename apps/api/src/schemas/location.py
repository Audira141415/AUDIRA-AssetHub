from typing import Optional, List
from pydantic import BaseModel

# Shared properties
class SiteBase(BaseModel):
    name: str
    address: Optional[str] = None

class SiteCreate(SiteBase):
    pass

class Site(SiteBase):
    id: int
    class Config:
        from_attributes = True

class BuildingBase(BaseModel):
    name: str
    site_id: int

class BuildingCreate(BuildingBase):
    pass

class Building(BuildingBase):
    id: int
    class Config:
        from_attributes = True

class FloorBase(BaseModel):
    name: str
    building_id: int

class FloorCreate(FloorBase):
    pass

class Floor(FloorBase):
    id: int
    class Config:
        from_attributes = True

class RoomBase(BaseModel):
    name: str
    floor_id: int

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    class Config:
        from_attributes = True

class RackBase(BaseModel):
    name: str
    room_id: int
    height_u: Optional[int] = 42
    width_mm: Optional[float] = None
    depth_mm: Optional[float] = None
    power_capacity_kw: Optional[float] = None

class RackCreate(RackBase):
    pass

class Rack(RackBase):
    id: int
    class Config:
        from_attributes = True

from src.schemas.asset import Asset

class RackVisualization(Rack):
    assets: List[Asset] = []
    utilization_percentage: float = 0.0
