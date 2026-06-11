from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.db.base import Base

class Role(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False) # Super Admin, Admin, Operator, Viewer
    description = Column(String, nullable=True)
    
    users = relationship("User", back_populates="role")
