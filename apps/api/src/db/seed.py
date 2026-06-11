import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.db.session import SessionLocal
from src.models.user import User
from src.models.role import Role
from src.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # Check if roles exist
        admin_role = db.query(Role).filter(Role.name == "Super Admin").first()
        if not admin_role:
            print("Creating Super Admin role...")
            admin_role = Role(name="Super Admin", description="Full access to all features")
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)

        # Check if admin user exists
        admin_user = db.query(User).filter(User.email == "admin@audira.local").first()
        if not admin_user:
            print("Creating Admin user...")
            hashed_password = get_password_hash("admin")
            admin_user = User(
                email="admin@audira.local",
                hashed_password=hashed_password,
                full_name="System Administrator",
                role_id=admin_role.id,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created successfully. (email: admin@audira.local, password: admin)")
        else:
            print("Admin user already exists.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
