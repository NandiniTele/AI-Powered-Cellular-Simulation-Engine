import numpy as np
import math
from typing import Dict, List, Any

class AIPredictionEngine:
    """
    AI model that generates cell-state forecasts, risk scores, mutation severity analyses,
    and therapeutic effectiveness calculations based on mathematical cellular models.
    """
    def __init__(self):
        pass

    def forecast_cellular_states(self, initial_state: Dict[str, float], conditions: Dict[str, Any], steps: int = 24) -> List[Dict[str, Any]]:
        """
        Generates a 24-step forecast (representing hours or time divisions) of the cellular states.
        Uses time-series biological equations to predict progression.
        """
        forecast = []
        current = initial_state.copy()
        
        # Pull parameters
        mutations = conditions.get("mutations", [])
        infection = conditions.get("infection", {})
        stress = conditions.get("stress", {})
        drugs = conditions.get("drugs", [])

        inf_type = infection.get("type", "None")
        inf_load = infection.get("load", 0.0)
        temp = stress.get("temp", 37.0)
        radiation = stress.get("radiation", 0.0)
        toxicity = stress.get("toxicity", 0.0)

        # Simulate state trajectories using dynamic steps
        for step in range(1, steps + 1):
            t = step / 4.0 # 0.25 hour intervals
            
            # Predict ATP decline or recovery curve
            atp_decay = 0.0
            if inf_load > 0:
                # Sigmoidal drop due to viral replication
                atp_decay += (inf_load * 30.0) / (1.0 + math.exp(-t + 2.0))
            if toxicity > 0:
                atp_decay += toxicity * 40.0 * (1.0 - math.exp(-t))
            if radiation > 0:
                atp_decay += radiation * 50.0 * (1.0 - math.exp(-0.5 * t))
            if "KRAS" in mutations or "EGFR" in mutations:
                atp_decay -= 10.0 # cancer cells maintain high glycolysis (Warburg effect)

            # Recover ATP if anti-infective or metabolic drugs are present
            atp_recovery = 0.0
            for drug in drugs:
                d_name = drug.get("name", "")
                d_dose = drug.get("dose", 0.0)
                if d_name == "Remdesivir" and inf_type == "Viral":
                    atp_recovery += d_dose * 25.0 * (1.0 - math.exp(-0.8 * t))
                if d_name == "Amoxicillin" and inf_type == "Bacterial":
                    atp_recovery += d_dose * 20.0 * (1.0 - math.exp(-0.8 * t))
                if d_name == "Metformin":
                    atp_recovery += d_dose * 5.0

            # Calculate forecast step
            step_atp = max(5.0, min(100.0, initial_state["atp_level"] - atp_decay + atp_recovery))
            
            # Oxidative stress trajectory
            ros_increase = (radiation * 60.0 + toxicity * 40.0 + (temp - 37.0) * 10.0) * (1.0 - math.exp(-0.3 * t))
            if inf_load > 0:
                ros_increase += inf_load * 35.0 * (1.0 - math.exp(-t))
            
            # Antioxidant scavenging
            ros_scavenge = 0.0
            for drug in drugs:
                if drug.get("name") == "NAC (N-Acetylcysteine)":
                    ros_scavenge += drug.get("dose", 0.0) * 45.0 * (1.0 - math.exp(-0.9 * t))
                if drug.get("name") == "Metformin":
                    ros_scavenge += drug.get("dose", 0.0) * 15.0

            step_ros = max(2.0, min(100.0, initial_state["oxidative_stress"] + ros_increase - ros_scavenge))

            # Apoptosis activation trajectory
            apoptosis_trigger = 0.0
            if "TP53" not in mutations: # p53 intact -> triggers apoptosis on DNA damage (radiation / doxorubicin)
                if radiation > 0:
                    apoptosis_trigger += radiation * 65.0 * (1.0 - math.exp(-0.2 * t))
                for drug in drugs:
                    if drug.get("name") == "Doxorubicin":
                        apoptosis_trigger += drug.get("dose", 0.0) * 75.0 * (1.0 - math.exp(-0.4 * t))
            else: # Cancerous TP53 mutation disables apoptotic cascade
                apoptosis_trigger = 2.0

            step_apoptosis = max(1.0, min(100.0, initial_state["apoptosis_marker"] + apoptosis_trigger))
            
            # Cellular health trajectory
            step_health = max(0.0, min(100.0, 100.0 - (100.0 - step_atp)*0.4 - step_ros*0.3 - step_apoptosis*0.5))

            forecast.append({
                "time_hour": round(t, 2),
                "atp_level": round(step_atp, 1),
                "oxidative_stress": round(step_ros, 1),
                "apoptosis_marker": round(step_apoptosis, 1),
                "health_score": round(step_health, 1)
            })

        return forecast

    def predict_risk_scores(self, conditions: Dict[str, Any], current_health: float) -> Dict[str, Any]:
        """
        Calculates biological pathology risk markers based on current microenvironment variables.
        """
        mutations = conditions.get("mutations", [])
        infection = conditions.get("infection", {})
        stress = conditions.get("stress", {})
        drugs = conditions.get("drugs", [])

        # 1. Oncogenesis (Cancer Progression) Risk
        # Driven by high mutations (KRAS, EGFR, loss of TP53) + oxidative stress
        cancer_drivers = 0.0
        if "TP53" in mutations: cancer_drivers += 40.0
        if "EGFR" in mutations: cancer_drivers += 25.0
        if "KRAS" in mutations: cancer_drivers += 30.0
        if "BRCA1" in mutations: cancer_drivers += 15.0
        
        cancer_risk = min(99.0, max(1.0, cancer_drivers + (100.0 - current_health) * 0.15))

        # 2. Cytokine Storm Risk
        # Driven by viral/bacterial infections + baseline inflammation
        inf_load = infection.get("load", 0.0)
        inf_type = infection.get("type", "None")
        cytokine_risk = 0.0
        if inf_load > 0:
            if inf_type == "Viral":
                cytokine_risk += inf_load * 85.0
            elif inf_type == "Bacterial":
                cytokine_risk += inf_load * 75.0
        
        # Dose response of chemo drugs can also irritate
        for drug in drugs:
            if drug.get("name") == "Doxorubicin":
                cytokine_risk += drug.get("dose", 0.0) * 15.0

        cytokine_risk = min(99.0, max(2.0, cytokine_risk))

        # 3. Cellular Necrosis (Violent rupture/death) Risk
        # High toxicity, extreme temp, severe depolarization
        toxicity = stress.get("toxicity", 0.0)
        temp = stress.get("temp", 37.0)
        necrosis_risk = toxicity * 80.0
        if temp > 40.0:
            necrosis_risk += (temp - 40.0) * 20.0
        
        # Add bacterial cell wall breakdown effects
        if inf_type == "Bacterial":
            necrosis_risk += inf_load * 30.0

        necrosis_risk = min(99.0, max(0.5, necrosis_risk))

        # 4. Mutation Severity Scoring
        # Predicts clinical severity indices for genetic disruptions
        mutation_severities = {}
        for mut in mutations:
            if mut == "TP53":
                mutation_severities["TP53"] = {"score": 9.4, "grade": "CRITICAL", "impact": "Disables DNA repair checkpoint (apoptosis suppression)."}
            elif mut == "KRAS":
                mutation_severities["KRAS"] = {"score": 8.8, "grade": "HIGH", "impact": "Locks cell proliferation loop into 'ON' state."}
            elif mut == "EGFR":
                mutation_severities["EGFR"] = {"score": 8.2, "grade": "HIGH", "impact": "Forces high protein transcription and surface receptor density."}
            elif mut == "BRCA1":
                mutation_severities["BRCA1"] = {"score": 7.5, "grade": "MODERATE", "impact": "Increases double-strand DNA breakage sensitivity."}

        return {
            "risks": {
                "oncogenesis_probability": round(cancer_risk, 1),
                "cytokine_storm_danger": round(cytokine_risk, 1),
                "cellular_necrosis_risk": round(necrosis_risk, 1)
            },
            "mutation_impact": mutation_severities
        }

    def predict_drug_response(self, drug_name: str, dose: float, conditions: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates binding efficiency, side-effects score, and therapeutic threshold index.
        """
        # Base Drug Database parameters
        drug_database = {
            "Metformin": {
                "target": "AMPK (PRKAA1)",
                "affinity": 92.5,
                "base_toxicity": 5.0,
                "pathways": ["Metabolism Activation", "Lactic Acidosis (at high doses)"]
            },
            "Doxorubicin": {
                "target": "Topoisomerase II / DNA",
                "affinity": 96.8,
                "base_toxicity": 65.0,
                "pathways": ["DNA Damage induction", "Cardiomyocyte mitochondrial toxicity"]
            },
            "Remdesivir": {
                "target": "Viral RdRp (NSP12)",
                "affinity": 89.2,
                "base_toxicity": 15.0,
                "pathways": ["Viral replication arrest", "Hepatic enzyme elevation"]
            },
            "Amoxicillin": {
                "target": "Penicillin-Binding Proteins",
                "affinity": 85.0,
                "base_toxicity": 8.0,
                "pathways": ["Bacterial cell wall disruption", "Intestinal microbiome shift"]
            },
            "NAC (N-Acetylcysteine)": {
                "target": "Free Radicals / Glutathione",
                "affinity": 94.0,
                "base_toxicity": 2.0,
                "pathways": ["Reactive oxygen species scavenging", "Glutathione pathway replenishment"]
            }
        }

        info = drug_database.get(drug_name, {
            "target": "Unknown Receptor",
            "affinity": 50.0,
            "base_toxicity": 10.0,
            "pathways": ["Non-specific protein binding"]
        })

        # Calculate binding affinity modified slightly by dose
        binding_affinity = info["affinity"] - (1.0 - dose) * 5.0 + np.random.uniform(-1.0, 1.0)
        binding_affinity = max(10.0, min(100.0, binding_affinity))

        # Toxicity curves (higher doses exponential toxicity)
        side_effects_score = info["base_toxicity"] * (dose ** 1.5) * 1.2
        side_effects_score = max(1.0, min(99.0, side_effects_score))

        # Therapeutic Index / Effectiveness
        # If Doxorubicin is applied to a cancer cell (EGFR or KRAS mutation), effectiveness is high.
        # If Remdesivir is applied during a viral infection, effectiveness is high.
        efficacy = 0.0
        mutations = conditions.get("mutations", [])
        infection = conditions.get("infection", {})
        inf_type = infection.get("type", "None")
        inf_load = infection.get("load", 0.0)

        if drug_name == "Doxorubicin" and ("EGFR" in mutations or "KRAS" in mutations or "TP53" in mutations):
            efficacy = dose * 95.0
        elif drug_name == "Remdesivir" and inf_type == "Viral" and inf_load > 0:
            efficacy = dose * 90.0
        elif drug_name == "Amoxicillin" and inf_type == "Bacterial" and inf_load > 0:
            efficacy = dose * 92.0
        elif drug_name == "Metformin":
            efficacy = dose * 80.0
        elif drug_name == "NAC (N-Acetylcysteine)":
            efficacy = dose * 85.0
        else:
            efficacy = dose * 30.0 # non-specific baseline helper

        # Randomize slightly for biotech authenticity
        efficacy = round(max(5.0, min(100.0, efficacy + np.random.uniform(-2.0, 2.0))), 1)

        return {
            "drug": drug_name,
            "dose": dose,
            "target_receptor": info["target"],
            "binding_affinity_pct": round(binding_affinity, 1),
            "therapeutic_efficacy_pct": efficacy,
            "side_effects_score": round(side_effects_score, 1),
            "affected_pathways": info["pathways"]
        }
