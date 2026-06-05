import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any
import asyncio
import json

# Import custom services
from app.api.auth import router as auth_router
from app.simulation.cell_engine import CellularStateEngine
from app.services.gnn_service import GNNPathwaySimulator
from app.services.prediction_engine import AIPredictionEngine

app = FastAPI(
    title="Virtual Human Cell Simulation Engine API",
    description="Futuristic AI-powered digital cellular simulator and GNN pathway network visualizer.",
    version="1.0.0"
)

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# Global Simulation state variables
CURRENT_MUTATIONS = []
CURRENT_DRUGS = []
CURRENT_INFECTION = {"type": "None", "load": 0.0}
CURRENT_STRESS = {"temp": 37.0, "radiation": 0.0, "toxicity": 0.0}

# Initialize engines
cell_engine = CellularStateEngine()
gnn_simulator = GNNPathwaySimulator()
ai_predictor = AIPredictionEngine()

# Request schemas for mutations, drugs, infections, stress
class MutationRequest(BaseModel):
    mutations: List[str]

class DrugRequest(BaseModel):
    name: str
    dose: float

class InfectionRequest(BaseModel):
    type: str  # Viral, Bacterial, None
    load: float # 0.0 to 1.0

class StressRequest(BaseModel):
    temp: float
    radiation: float
    toxicity: float

# REST endpoints to manage and observe virtual cellular environments
@app.get("/")
def get_root():
    return {
        "status": "ONLINE",
        "engine": "AI-Powered Cellular Simulation Engine v1.0",
        "timestamp": "2026-06-01"
    }

@app.get("/api/cell/status")
def get_cell_status():
    conditions = {
        "mutations": CURRENT_MUTATIONS,
        "drugs": CURRENT_DRUGS,
        "infection": CURRENT_INFECTION,
        "stress": CURRENT_STRESS
    }
    metrics = cell_engine.get_current_metrics()
    pathways = gnn_simulator.simulate_pathways(CURRENT_MUTATIONS, CURRENT_DRUGS)
    risks = ai_predictor.predict_risk_scores(conditions, metrics["health_score"])
    
    return {
        "conditions": conditions,
        "metrics": metrics,
        "pathway_activity": pathways["pathway_scores"],
        "pathway_graph": pathways["graph"],
        "clinical_risks": risks["risks"],
        "mutation_impact": risks["mutation_impact"]
    }

@app.post("/api/cell/reset")
def reset_cell():
    global CURRENT_MUTATIONS, CURRENT_DRUGS, CURRENT_INFECTION, CURRENT_STRESS
    CURRENT_MUTATIONS = []
    CURRENT_DRUGS = []
    CURRENT_INFECTION = {"type": "None", "load": 0.0}
    CURRENT_STRESS = {"temp": 37.0, "radiation": 0.0, "toxicity": 0.0}
    cell_engine.reset()
    return {"status": "SUCCESS", "message": "Cell reset to homeostatic baseline state."}

@app.post("/api/cell/mutations")
def update_mutations(payload: MutationRequest):
    global CURRENT_MUTATIONS
    CURRENT_MUTATIONS = payload.mutations
    return {"status": "SUCCESS", "mutations": CURRENT_MUTATIONS}

@app.post("/api/cell/drugs/apply")
def apply_drug(payload: DrugRequest):
    global CURRENT_DRUGS
    # Filter out if already exists, then apply
    CURRENT_DRUGS = [d for d in CURRENT_DRUGS if d["name"] != payload.name]
    if payload.dose > 0:
        CURRENT_DRUGS.append({"name": payload.name, "dose": payload.dose})
    
    # Calculate immediate dose response prediction
    conditions = {
        "mutations": CURRENT_MUTATIONS,
        "drugs": CURRENT_DRUGS,
        "infection": CURRENT_INFECTION,
        "stress": CURRENT_STRESS
    }
    response_prediction = ai_predictor.predict_drug_response(payload.name, payload.dose, conditions)
    
    return {
        "status": "SUCCESS", 
        "active_drugs": CURRENT_DRUGS,
        "prediction": response_prediction
    }

@app.post("/api/cell/drugs/clear")
def clear_drugs():
    global CURRENT_DRUGS
    CURRENT_DRUGS = []
    return {"status": "SUCCESS", "message": "All cellular drug treatments cleared."}

@app.post("/api/cell/infection")
def set_infection(payload: InfectionRequest):
    global CURRENT_INFECTION
    CURRENT_INFECTION = {"type": payload.type, "load": payload.load}
    return {"status": "SUCCESS", "infection": CURRENT_INFECTION}

@app.post("/api/cell/stress")
def set_stress(payload: StressRequest):
    global CURRENT_STRESS
    CURRENT_STRESS = {
        "temp": payload.temp,
        "radiation": payload.radiation,
        "toxicity": payload.toxicity
    }
    return {"status": "SUCCESS", "stress": CURRENT_STRESS}

@app.get("/api/cell/forecast")
def get_forecast():
    metrics = cell_engine.get_current_metrics()
    conditions = {
        "mutations": CURRENT_MUTATIONS,
        "drugs": CURRENT_DRUGS,
        "infection": CURRENT_INFECTION,
        "stress": CURRENT_STRESS
    }
    forecast_data = ai_predictor.forecast_cellular_states(metrics, conditions, steps=24)
    return {"forecast": forecast_data}

# WebSocket for real-time cellular data feed
@app.websocket("/ws/cellular-simulation")
async def websocket_simulation(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Re-compile active conditions on each iteration
            conditions = {
                "mutations": CURRENT_MUTATIONS,
                "drugs": CURRENT_DRUGS,
                "infection": CURRENT_INFECTION,
                "stress": CURRENT_STRESS
            }
            
            # Step the cell mathematical engine
            metrics = cell_engine.update(conditions)
            
            # Run biological signaling propagation
            pathways = gnn_simulator.simulate_pathways(CURRENT_MUTATIONS, CURRENT_DRUGS)
            
            # Formulate AI health projections
            risks = ai_predictor.predict_risk_scores(conditions, metrics["health_score"])
            
            payload = {
                "conditions": conditions,
                "metrics": metrics,
                "pathway_activity": pathways["pathway_scores"],
                "pathway_graph": pathways["graph"],
                "clinical_risks": risks["risks"],
                "mutation_impact": risks["mutation_impact"]
            }
            
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(1.0) # Feed updates at 1Hz frequency
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WS error: {e}")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
