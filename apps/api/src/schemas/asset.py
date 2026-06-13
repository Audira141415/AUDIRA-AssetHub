from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel

class AssetCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class AssetCategoryCreate(AssetCategoryBase):
    pass

class AssetCategory(AssetCategoryBase):
    id: int
    class Config:
        from_attributes = True

class AssetBase(BaseModel):
    asset_tag: str
    hostname: Optional[str] = None
    serial_number: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    status: Optional[str] = "Active"
    vendor: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_start: Optional[date] = None
    warranty_end: Optional[date] = None
    
    category_id: int
    rack_id: Optional[int] = None
    u_position: Optional[int] = None
    
    owner: Optional[str] = None
    department: Optional[str] = None
    notes: Optional[str] = None

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[AssetCategory] = None
    
    class Config:
        from_attributes = True

class AssetMovementCreate(BaseModel):
    new_rack_id: Optional[int] = None
    new_u_position: Optional[int] = None
    action: str
    notes: Optional[str] = None

class AssetMovementResponse(BaseModel):
    id: int
    asset_id: int
    user_id: int
    previous_rack_id: Optional[int] = None
    new_rack_id: Optional[int] = None
    action: str
    notes: Optional[str] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True
