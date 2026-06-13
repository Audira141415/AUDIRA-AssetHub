import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.db.session import SessionLocal
from src.models.asset import Asset

def cleanup():
    db = SessionLocal()
    
    # Delete the accidentally created server assets
    unwanted_assets = db.query(Asset).filter(Asset.asset_tag.like("AST-BTM-%")).all()
    print(f"Deleting {len(unwanted_assets)} unwanted assets...")
    
    for asset in unwanted_assets:
        db.delete(asset)
        
    db.commit()
    print("Cleanup successful.")

if __name__ == "__main__":
    cleanup()
