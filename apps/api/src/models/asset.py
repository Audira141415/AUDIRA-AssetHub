from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base import Base

class AssetCategory(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    
    assets = relationship("Asset", back_populates="category")

class Asset(Base):
    id = Column(Integer, primary_key=True, index=True)
    asset_tag = Column(String, unique=True, index=True, nullable=False)
    hostname = Column(String, index=True, nullable=True)
    serial_number = Column(String, index=True, nullable=True)
    manufacturer = Column(String, nullable=True)
    model = Column(String, nullable=True)
    
    status = Column(String, default="Active") # Active, Spare, Maintenance, Retired, Decommissioned
    vendor = Column(String, nullable=True)
    purchase_date = Column(Date, nullable=True)
    warranty_start = Column(Date, nullable=True)
    warranty_end = Column(Date, nullable=True)
    
    # Relationships
    category_id = Column(Integer, ForeignKey("assetcategory.id"))
    rack_id = Column(Integer, ForeignKey("rack.id"), nullable=True)
    u_position = Column(Integer, nullable=True)
    
    owner = Column(String, nullable=True)
    department = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    category = relationship("AssetCategory", back_populates="assets")
    rack = relationship("Rack", back_populates="assets")
    movements = relationship("AssetMovement", back_populates="asset")

class AssetMovement(Base):
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("asset.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    previous_rack_id = Column(Integer, ForeignKey("rack.id"), nullable=True)
    new_rack_id = Column(Integer, ForeignKey("rack.id"), nullable=True)
    action = Column(String, nullable=False) # e.g., "Relocated", "Status Change", "Created"
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    asset = relationship("Asset", back_populates="movements")
    user = relationship("User") # Assuming User is imported or accessible. Actually, we should just use string if we don't import User here, but User is in src.models.user. Wait, SQLAlchemy strings in ForeignKey are fine.
    previous_rack = relationship("Rack", foreign_keys=[previous_rack_id])
    new_rack = relationship("Rack", foreign_keys=[new_rack_id])
