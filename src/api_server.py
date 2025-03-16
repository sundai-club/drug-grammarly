from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys
from typing import List, Dict, Any, Optional

# Add parent directory to path to import from parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the DrugInteractionAgent from the parent directory
from drug_interaction import DrugInteractionAgent
from db_utils import search_drugs

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the agent with API keys
# In production, use environment variables or a more secure method
api_key = os.environ.get("GEMINI_API_KEY", "")
search_api_key = os.environ.get("GOOGLE_SEARCH_API_KEY", "")

# Initialize the agent
agent = DrugInteractionAgent(api_key, search_api_key)

class DrugInteractionRequest(BaseModel):
    drug1: str
    drug2: str

class PatientInfo(BaseModel):
    history: List[str] = []
    past_medications: List[str] = []
    current_medications: List[str] = []
    conditions: List[str] = []
    allergies: List[str] = []
    demographics: Dict[str, Any] = {}
    family_history: List[str] = []
    image_url: Optional[str] = None

class AnalysisRequest(BaseModel):
    patient_info: PatientInfo
    new_drug: str

@app.post("/analyze-interaction")
async def analyze_interaction(request: DrugInteractionRequest):
    if not api_key or not search_api_key:
        raise HTTPException(status_code=500, detail="API keys not configured")
    
    try:
        # Check database for known interactions
        db_results = search_drugs(request.drug1, request.drug2)
        
        # Get analysis from Gemini
        analysis = agent.analyze_interaction(request.drug1, request.drug2)
        
        return {
            "db_results": db_results,
            "ai_analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-patient-drug")
async def analyze_patient_drug(request: AnalysisRequest):
    if not api_key or not search_api_key:
        raise HTTPException(status_code=500, detail="API keys not configured")
    
    try:
        # Check for conflicts with current medications
        conflicts = []
        for current_med in request.patient_info.current_medications:
            db_results = search_drugs(request.new_drug, current_med)
            if db_results:
                conflicts.append({
                    "drug": current_med,
                    "side_effects": db_results
                })
        
        # Get analysis from Gemini if needed
        ai_analysis = None
        if conflicts:
            # For the first conflict, get detailed analysis
            ai_analysis = agent.analyze_interaction(
                request.new_drug, 
                conflicts[0]["drug"]
            )
        
        return {
            "conflicts": conflicts,
            "ai_analysis": ai_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
