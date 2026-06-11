from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
import qrcode
import io
from typing import Any
from src.api.deps import SessionDep, CurrentUser
from src.models.asset import Asset
from src.core.config import settings

router = APIRouter()

@router.get("/{asset_tag}/generate")
def generate_qr_code(asset_tag: str, db: SessionDep) -> Response:
    # We might want to verify the asset exists first
    asset = db.query(Asset).filter(Asset.asset_tag == asset_tag).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Generate URL pointing to the frontend public QR scan page
    # In a real app, this base URL would be configured in settings.
    # For now, we assume frontend runs on port 3000
    base_url = "http://localhost:3000"
    target_url = f"{base_url}/q/{asset_tag}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(target_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    
    return Response(content=buf.getvalue(), media_type="image/png")
