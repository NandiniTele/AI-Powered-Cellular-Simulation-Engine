# AI-Powered Cellular Simulation Engine (Virtual Human Cell)

Welcome to the **Virtual Human Cell Simulator**, a next-generation full-stack digital laboratory designed to model cellular biophysics and forecast transcription signaling pathways under diseases, mutations, infections, physical stressors, and drug therapies.

---

## 🚀 Core Features & Laboratory Divisions

### 1. Interactive Subcellular Dashboard
A glassmorphic status deck monitoring overall cellular health, ATP respiration, resting membrane voltage gradients, oxidative stress index, and cytokine profiles in real time.

### 2. Live Biophysics Telemetry System
WebSocket-driven data sync at 1Hz frequency. The cell physics engine recalculates dynamic biophysics variables continuously.

### 3. GNN Signaling Pathway Simulator
A directed macromolecular interaction graph (modeled using NetworkX) propagating signals across crucial oncology checkpoints (MAPK, AKT, TP53, and metabolic AMPK networks).

### 4. Disease Preset Suite
Induce complex clinical pathologies instantly (Oncology Proliferations, Neurodegenerative Amyloid Cytotoxicities, Diabetes Cristae decays, and Anoxia Necrosis).

### 5. Molecular Drug Testing Console
Apply small-molecule agents (Metformin, Chemotherapeutic Doxorubicin, Antiviral Remdesivir, Amoxicillin, and NAC) virtually to map binding affinities, side effects, and therapeutic thresholds.

### 6. Mutation Analyzer
Transfect genetic sequences (TP53 point changes, KRAS, EGFR activations) with point-mutation codon visualizations and clinical severity profiles.

### 7. Transfection & Physical Stress
Simulate viral transfection (ACE2 binding) or physical stress loads (temperatures, UV ionization, chemical toxins) to observe adaptive Heat-Shock (Hsp70) chaperones.

### 8. Analytics & Research Logs
Compare time-series 24h predictive curves utilizing beautiful Recharts visualizations, log hypotheses inside local workspaces, and export observations in JSON format.

---

## 🛠️ Technology Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti
* **Backend:** Python, FastAPI, WebSockets, Uvicorn, NetworkX, PyJWT (Jose), NumPy

---

## 🏃 Quick Start Guide

### Start the FastAPI Simulation Backend:
```powershell
python backend/run.py
```
* Runs at `http://127.0.0.1:8000`
* Swagger docs available at `http://127.0.0.1:8000/docs`

### Start the React Hot-Reloading Frontend:
```powershell
cd frontend
npm run dev
```
* Runs at `http://localhost:5173`

---

## 🔬 Scientific Credentials (Default Access)
* **Username:** `admin`
* **Password:** `admin`
* **Role:** Lead Researcher
