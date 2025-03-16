from fastapi import FastAPI
from src.drug_interaction import analyze_drug_interactions
from src.db_utils import search_drugs
from src.final_report import generate_final_report
from fastapi.middleware.cors import CORSMiddleware
import time


api_key = "ADD YOU GEMINI API KEY"
search_api_key = "ADD YOUR GOOGLE CUSTOM SEARCH API"


drug1 = "ibuprofen"
drug2 = "aspirin"

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
async def analyze_interaction(patient_data: dict):
    test_drug = patient_data["test_drug"]
    past_medications = patient_data["past_medications"]
    current_medications = patient_data["current_medications"]
    supplements = patient_data["supplements"]
    allergies = patient_data["allergies"]
    adverse_events = patient_data["adverse_events"]
    family_history = patient_data["family_history"]


    drug_combinations = []
    for med in current_medications:
        drug_combinations.append([test_drug, med])
    

    db_results = []
    reports = []

    for combination in drug_combinations:
        drug1 = combination[0]
        drug2 = combination[1]
        time.sleep(1)
        results = search_drugs(drug1, drug2)
        db_results.append(results)
        reports.append(analyze_drug_interactions(drug1, drug2))

    
    final_report = generate_final_report(db_results, '\n'.join(reports))
    


    return final_report


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

