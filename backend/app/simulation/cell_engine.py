import math
import random
from typing import Dict, Any

class CellularStateEngine:
    """
    Simulates cellular biophysics and biochemistry using simplified differential-like models.
    Reacts to mutations, drugs, infections, and environmental stressors.
    """
    def __init__(self):
        # Default healthy homeostatic state
        self.reset()

    def reset(self):
        self.atp_level = 95.0          # % of max capacity
        self.membrane_potential = -70.0 # mV (typical resting potential)
        self.protein_synthesis = 90.0   # % efficiency
        self.oxidative_stress = 10.0    # % Reactive Oxygen Species (ROS)
        self.apoptosis_marker = 5.0     # % trigger signal
        self.cytokine_level = 12.0      # pg/mL (inflammation marker)
        self.health_score = 98.0        # Overall health index (0-100)
        self.cellular_age = 20.0        # Simulated cell age in replication terms

    def update(self, conditions: Dict[str, Any]) -> Dict[str, Any]:
        """
        Updates the cellular state based on applied external variables.
        conditions example:
        {
            "mutations": ["TP53", "EGFR"],
            "drugs": [{"name": "Doxorubicin", "dose": 0.5}],
            "infections": {"type": "Viral", "viral_load": 0.4},
            "stress": {"temp": 39.5, "radiation": 0.2, "toxicity": 0.1}
        }
        """
        mutations = conditions.get("mutations", [])
        drugs = conditions.get("drugs", [])
        infection = conditions.get("infection", {})
        stress = conditions.get("stress", {})

        # Base recovery and baseline drift
        # Healthy cell wants to pull back to homeostasis
        target_atp = 95.0
        target_membrane = -70.0
        target_protein = 90.0
        target_ros = 10.0
        target_apoptosis = 5.0
        target_cytokines = 12.0

        # Apply Genetic Mutation Effects
        # TP53: Tumor suppressor inactivation -> leads to resistance to apoptosis, high DNA damage
        if "TP53" in mutations:
            target_apoptosis -= 20.0  # Inability to trigger apoptosis when damaged
            target_ros += 15.0
        if "EGFR" in mutations:
            # EGFR hyperactivation -> high protein synthesis, cell division signaling
            target_protein += 15.0
            target_atp += 5.0
        if "BRCA1" in mutations:
            # DNA repair deficiency
            target_ros += 25.0
            target_apoptosis += 10.0
        if "KRAS" in mutations:
            # Hyperactive signaling, metabolic rewiring
            target_atp += 8.0
            target_protein += 10.0
            target_ros += 10.0

        # Apply Environmental Stressors
        # Temperature stress (Hyperthermia triggers heat shock proteins, but lowers efficiency)
        temp = stress.get("temp", 37.0)
        if temp > 37.0:
            diff = temp - 37.0
            target_atp -= diff * 8.0
            target_protein -= diff * 5.0
            target_ros += diff * 12.0
            target_cytokines += diff * 6.0
        
        # Radiation (DNA damage, spikes ROS and apoptosis)
        radiation = stress.get("radiation", 0.0) # 0.0 to 1.0
        if radiation > 0.0:
            target_ros += radiation * 60.0
            target_apoptosis += radiation * 75.0
            target_protein -= radiation * 30.0
            target_atp -= radiation * 20.0

        # Chemical Toxicity
        toxicity = stress.get("toxicity", 0.0) # 0.0 to 1.0
        if toxicity > 0.0:
            target_atp -= toxicity * 50.0
            target_membrane += toxicity * 25.0 # Depolarization (moves closer to 0)
            target_ros += toxicity * 50.0
            target_protein -= toxicity * 40.0
            target_apoptosis += toxicity * 30.0

        # Apply Infection Effects
        inf_type = infection.get("type", "None")
        inf_load = infection.get("load", 0.0) # 0.0 to 1.0
        if inf_type == "Viral" and inf_load > 0.0:
            # Viral replication hijacks ribosomes (protein synthesis), kills cell
            target_protein -= inf_load * 50.0
            target_atp -= inf_load * 40.0
            target_cytokines += inf_load * 70.0  # Spike cytokines (cytokine storm)
            target_apoptosis += inf_load * 40.0
            target_ros += inf_load * 30.0
        elif inf_type == "Bacterial" and inf_load > 0.0:
            # Bacterial toxins disrupt membrane potential, spark massive immune response
            target_membrane += inf_load * 30.0 # severe depolarization
            target_atp -= inf_load * 30.0
            target_cytokines += inf_load * 80.0 # major inflammatory cytokine trigger
            target_ros += inf_load * 40.0
            target_apoptosis += inf_load * 20.0

        # Apply Drug Interactions (Therapeutic effect / Toxicity counter)
        for drug in drugs:
            drug_name = drug.get("name", "")
            dose = drug.get("dose", 0.0) # 0.0 to 1.0
            
            if drug_name == "Metformin":
                # Metformin improves metabolic efficiency, lowers ROS, increases insulin sensitivity
                target_atp = max(50.0, target_atp - dose * 5.0) # slightly decreases oxidative phosphorylation
                target_ros = max(5.0, target_ros - dose * 25.0) # decreases ROS
                target_cytokines = max(5.0, target_cytokines - dose * 15.0) # anti-inflammatory
            
            elif drug_name == "Doxorubicin":
                # Chemotherapy: damages DNA, kills cancer cells (spikes ROS, forces apoptosis)
                target_ros += dose * 50.0
                target_apoptosis += dose * 70.0
                target_atp -= dose * 30.0
                target_protein -= dose * 20.0
                
            elif drug_name == "Remdesivir":
                # Antiviral: inhibits viral RNA synthesis (restores cell ribosome/protein synthesis, lowers viral load)
                if inf_type == "Viral":
                    # Simulate effective cure by damping infection effects
                    target_protein = min(90.0, target_protein + dose * 40.0)
                    target_atp = min(95.0, target_atp + dose * 30.0)
                    target_cytokines = max(12.0, target_cytokines - dose * 50.0)
                    target_apoptosis = max(5.0, target_apoptosis - dose * 30.0)
                    
            elif drug_name == "Amoxicillin":
                # Antibiotic: targets bacterial cell walls (neutralizes bacterial load)
                if inf_type == "Bacterial":
                    target_membrane = max(-70.0, target_membrane - dose * 25.0)
                    target_cytokines = max(12.0, target_cytokines - dose * 60.0)
                    target_ros = max(10.0, target_ros - dose * 30.0)
                    target_atp = min(95.0, target_atp + dose * 20.0)

            elif drug_name == "NAC (N-Acetylcysteine)":
                # Antioxidant: sweeps away ROS
                target_ros = max(5.0, target_ros - dose * 40.0)
                target_apoptosis = max(5.0, target_apoptosis - dose * 15.0)

        # Dynamic updates using numerical smoothing (differential-like integration)
        alpha = 0.2 # learning/integration rate
        self.atp_level += alpha * (target_atp - self.atp_level)
        self.membrane_potential += alpha * (target_membrane - self.membrane_potential)
        self.protein_synthesis += alpha * (target_protein - self.protein_synthesis)
        self.oxidative_stress += alpha * (target_ros - self.oxidative_stress)
        self.apoptosis_marker += alpha * (target_apoptosis - self.apoptosis_marker)
        self.cytokine_level += alpha * (target_cytokines - self.cytokine_level)

        # Safeguard ranges
        self.atp_level = max(0.0, min(100.0, self.atp_level))
        self.membrane_potential = max(-95.0, min(-20.0, self.membrane_potential))
        self.protein_synthesis = max(0.0, min(120.0, self.protein_synthesis))
        self.oxidative_stress = max(0.0, min(100.0, self.oxidative_stress))
        self.apoptosis_marker = max(0.0, min(100.0, self.apoptosis_marker))
        self.cytokine_level = max(0.0, min(200.0, self.cytokine_level))

        # Calculate Overall Health Score
        # High oxidative stress, high apoptosis, extreme membrane depolarization, and low ATP reduce health.
        health_deduction = 0.0
        health_deduction += (95.0 - self.atp_level) * 0.4
        
        # Membrane depolarized (closer to 0 is bad, healthy is -70)
        depol = self.membrane_potential - (-70.0)
        if depol > 0:
            health_deduction += depol * 0.8
        else:
            health_deduction += abs(depol) * 0.2 # hyperpolarization also slightly bad
            
        health_deduction += (self.oxidative_stress - 10.0) * 0.4
        health_deduction += (self.apoptosis_marker - 5.0) * 0.5
        health_deduction += max(0.0, self.cytokine_level - 12.0) * 0.2

        self.health_score = max(0.0, min(100.0, 100.0 - health_deduction))

        # Random micro-fluctuations for biological realism
        self.atp_level += random.uniform(-0.5, 0.5)
        self.oxidative_stress += random.uniform(-0.3, 0.3)
        self.health_score += random.uniform(-0.1, 0.1)

        # Clip values
        self.atp_level = max(0.0, min(100.0, self.atp_level))
        self.oxidative_stress = max(0.0, min(100.0, self.oxidative_stress))
        self.health_score = max(0.0, min(100.0, self.health_score))

        return self.get_current_metrics()

    def get_current_metrics(self) -> Dict[str, float]:
        return {
            "atp_level": round(self.atp_level, 2),
            "membrane_potential": round(self.membrane_potential, 2),
            "protein_synthesis": round(self.protein_synthesis, 2),
            "oxidative_stress": round(self.oxidative_stress, 2),
            "apoptosis_marker": round(self.apoptosis_marker, 2),
            "cytokine_level": round(self.cytokine_level, 2),
            "health_score": round(self.health_score, 2),
            "cellular_age": round(self.cellular_age, 2)
        }
