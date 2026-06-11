from typing import Optional
from pydantic import BaseModel

# Shared properties
class UserBase(BaseModel):
    email: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    full_name: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: str
    password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

class RoleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

# Additional properties to return via API
class User(UserInDBBase):
    role_id: Optional[int] = None
    role: Optional[RoleResponse] = None

# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
