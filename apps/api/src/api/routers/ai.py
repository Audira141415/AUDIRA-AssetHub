import random
from datetime import date, timedelta
from typing import Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.api.deps import SessionDep, CurrentUser
from src.models.asset import Asset
from src.models.location import Rack

router = APIRouter()

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
def ai_chat(query: ChatMessage, db: SessionDep, current_user: CurrentUser) -> Any:
    message = query.message.lower()
    
    # This is a mock AI that uses simple keyword matching to return real DB stats.
    # In a real implementation, you would pass `query.message` to an LLM like OpenAI
    # along with a system prompt and some context/RAG tools.
    
    if "how many" in message and "asset" in message:
        total = db.query(Asset).count()
        return {"response": f"I found a total of {total} assets currently tracked in the system."}
        
    elif "warranty" in message or "expire" in message:
        today = date.today()
        threshold_date = today + timedelta(days=90)
        expiring = db.query(Asset).filter(
            Asset.warranty_end != None,
            Asset.warranty_end <= threshold_date
        ).count()
        if expiring > 0:
            return {"response": f"Attention: You have {expiring} asset(s) with warranties expiring in the next 90 days. Please check the Warranty dashboard for details."}
        else:
            return {"response": f"All good! No assets have warranties expiring in the next 90 days."}
            
    elif "rack" in message or "utilization" in message:
        racks = db.query(Rack).count()
        return {"response": f"We are currently managing {racks} physical racks in the system. You can view their individual utilizations on the Racks page."}
        
    elif "hello" in message or "hi " in message:
        return {"response": f"Hello {current_user.full_name or 'there'}! I am your Audira Smart Assistant. I can help you query inventory, check warranties, or analyze rack utilization. What would you like to know?"}
        
    else:
        # Fallback simulated AI response
        responses = [
            "I'm an early MVP version of the Audira AI Assistant. Try asking me about 'total assets', 'expiring warranties', or 'rack utilization'.",
            "I'm currently processing your query. As a mock AI, my capabilities are currently limited to basic inventory queries.",
            "That's an interesting question about the data center. Once my LLM integration is fully complete in the next phase, I'll be able to answer that perfectly!"
        ]
        return {"response": random.choice(responses)}
