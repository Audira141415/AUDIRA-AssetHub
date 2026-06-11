from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.deps import SessionDep, CurrentUser
from src.models.user import User as UserModel
from src.models.role import Role as RoleModel
from src.schemas.user import User, UserCreate, RoleResponse
from src.core.security import get_password_hash

router = APIRouter()

@router.get("/", response_model=List[User])
def read_users(db: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    # Normally we'd check if current_user.is_superuser or role is Admin
    return db.query(UserModel).offset(skip).limit(limit).all()

@router.post("/", response_model=User)
def create_user(user_in: UserCreate, db: SessionDep, current_user: CurrentUser) -> Any:
    user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user_data = user_in.model_dump(exclude={"password"})
    user_data["hashed_password"] = get_password_hash(user_in.password)
    user = UserModel(**user_data)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/roles", response_model=List[RoleResponse])
def read_roles(db: SessionDep, current_user: CurrentUser) -> Any:
    return db.query(RoleModel).all()
