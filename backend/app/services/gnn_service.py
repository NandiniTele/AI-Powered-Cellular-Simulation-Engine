import networkx as nx
from typing import Dict, List, Any

class GNNPathwaySimulator:
    """
    Simulates graph signaling propagation through key intracellular pathways
    (MAPK, AKT, p53, Cell Cycle) using NetworkX.
    Calculates path activation scores dynamically based on mutations and drugs.
    """
    def __init__(self) -> None:
        self.graph = nx.DiGraph()
        self._initialize_knowledge_graph()

    def _initialize_knowledge_graph(self) -> None:
        # Define Nodes (Genes / Proteins / Complexes)
        # Nucleus & Control
        self.graph.add_node("TP53", type="Gene", function="Tumor Suppressor", baseline_expression=1.0)
        self.graph.add_node("BRCA1", type="Gene", function="DNA Double Strand Repair", baseline_expression=1.0)
        self.graph.add_node("MDM2", type="Protein", function="TP53 Inhibitor (E3 Ligase)", baseline_expression=1.0)
        self.graph.add_node("BCL2", type="Protein", function="Anti-apoptotic Regulator", baseline_expression=1.0)
        self.graph.add_node("BAX", type="Protein", function="Pro-apoptotic Pore Former", baseline_expression=1.0)
        
        # Receptor Tyrosine Kinase (RTK) / Growth Signals
        self.graph.add_node("EGFR", type="Receptor", function="Epidermal Growth Factor Receptor", baseline_expression=1.0)
        self.graph.add_node("KRAS", type="Protein", function="GTPase Signal Transducer", baseline_expression=1.0)
        self.graph.add_node("RAF1", type="Protein", function="MAPKKK Kinase", baseline_expression=1.0)
        self.graph.add_node("MEK1", type="Protein", function="MAPKK Kinase", baseline_expression=1.0)
        self.graph.add_node("ERK1", type="Protein", function="MAPK Transcription Activator", baseline_expression=1.0)
        
        # PI3K / AKT / mTOR survival pathway
        self.graph.add_node("PI3K", type="Protein", function="Phosphoinositide 3-Kinase", baseline_expression=1.0)
        self.graph.add_node("AKT1", type="Protein", function="Survival Protein Kinase", baseline_expression=1.0)
        self.graph.add_node("MTOR", type="Protein", function="Growth & Synthesis Regulator", baseline_expression=1.0)
        self.graph.add_node("AMPK", type="Protein", function="Energy Status Sensor", baseline_expression=1.0)

        # Define Biological Directed Relationships (activation/inhibition)
        # 1. p53 apoptotic pathway
        self.graph.add_edge("TP53", "MDM2", relation="activates", weight=1.0)
        self.graph.add_edge("MDM2", "TP53", relation="inhibits", weight=-1.0)
        self.graph.add_edge("TP53", "BAX", relation="activates", weight=1.5)
        self.graph.add_edge("TP53", "BCL2", relation="inhibits", weight=-1.2)
        self.graph.add_edge("BCL2", "BAX", relation="inhibits", weight=-1.0)
        
        # 2. EGFR / MAPK pathway
        self.graph.add_edge("EGFR", "KRAS", relation="activates", weight=1.2)
        self.graph.add_edge("KRAS", "RAF1", relation="activates", weight=1.2)
        self.graph.add_edge("RAF1", "MEK1", relation="activates", weight=1.2)
        self.graph.add_edge("MEK1", "ERK1", relation="activates", weight=1.2)
        
        # 3. PI3K / AKT / mTOR survival pathway
        self.graph.add_edge("EGFR", "PI3K", relation="activates", weight=1.0)
        self.graph.add_edge("PI3K", "AKT1", relation="activates", weight=1.2)
        self.graph.add_edge("AKT1", "MTOR", relation="activates", weight=1.2)
        self.graph.add_edge("AKT1", "BCL2", relation="activates", weight=1.0) # survival signal inhibits death
        
        # AMPK crosstalk (Metformin)
        self.graph.add_edge("AMPK", "MTOR", relation="inhibits", weight=-1.5)
        
        # DNA repair pathway
        self.graph.add_edge("BRCA1", "TP53", relation="activates", weight=0.8) # DNA repair recruits p53 if failed

    def simulate_pathways(self, active_mutations: List[str], active_drugs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Runs signal propagation through GNN knowledge representation.
        Calculates pathway activity index (0-100%) for:
        - Apoptosis Pathway
        - MAPK Proliferation Pathway
        - AKT Survival Pathway
        - Metabolic/AMPK Pathway
        """
        # Node states: initialized to baseline
        node_states = {node: data["baseline_expression"] for node, data in self.graph.nodes(data=True)}
        
        # Apply mutations directly to nodes (Primary drivers)
        if "TP53" in active_mutations:
            node_states["TP53"] = 0.0 # Mutation is loss-of-function (cancerous)
        if "EGFR" in active_mutations:
            node_states["EGFR"] = 3.0 # Hyperactivation
        if "KRAS" in active_mutations:
            node_states["KRAS"] = 2.5 # Oncogenic lock-on
        if "BRCA1" in active_mutations:
            node_states["BRCA1"] = 0.1 # DNA repair impairment

        # Apply drugs directly to nodes
        for drug in active_drugs:
            name = drug.get("name", "")
            dose = drug.get("dose", 0.0)
            if name == "Metformin":
                node_states["AMPK"] += dose * 2.0 # Activates metabolic sensor
            elif name == "Doxorubicin":
                # Chemotherapy causes DNA damage, activates p53 if functional, damages BRCA1/DNA mechanisms
                if node_states["TP53"] > 0:
                    node_states["TP53"] += dose * 2.0
                node_states["BRCA1"] = max(0.0, node_states["BRCA1"] - dose * 0.8)
                node_states["BCL2"] = max(0.0, node_states["BCL2"] - dose * 0.9) # forces apoptosis

        # Simple Iterative Signal Propagation (Graph Convolution Model)
        # Propagation happens through 3 computational biological rounds (iterations)
        rounds = 3
        for _ in range(rounds):
            new_states = node_states.copy()
            for u, v, data in self.graph.edges(data=True):
                weight = data["weight"]
                # Calculate signaling magnitude
                signal = node_states[u] * weight
                
                if weight > 0:
                    new_states[v] += signal * 0.25
                else:
                    # Inhibition reduces active state
                    new_states[v] = max(0.0, new_states[v] + (signal * 0.25))
            node_states = new_states

        # Normalize outputs into standard human-readable percentage activation ranges (0-100)
        apoptosis_activation = min(100.0, max(0.0, (node_states["BAX"] / (node_states["BCL2"] + 0.1)) * 25.0))
        mapk_activation = min(100.0, max(0.0, (node_states["ERK1"]) * 30.0))
        akt_activation = min(100.0, max(0.0, (node_states["AKT1"] + node_states["MTOR"]) * 20.0))
        metabolic_activation = min(100.0, max(0.0, (node_states["AMPK"]) * 40.0))

        # Compile detailed state representation for knowledge graph rendering in UI
        nodes_data = []
        for node, data in self.graph.nodes(data=True):
            nodes_data.append({
                "id": node,
                "type": data["type"],
                "function": data["function"],
                "activation": round(min(100.0, max(0.0, node_states[node] * 33.3)), 1)
            })

        edges_data = []
        for u, v, data in self.graph.edges(data=True):
            edges_data.append({
                "source": u,
                "target": v,
                "relation": data["relation"],
                "weight": data["weight"]
            })

        return {
            "pathway_scores": {
                "apoptosis": round(apoptosis_activation, 1),
                "mapk_proliferation": round(mapk_activation, 1),
                "akt_survival": round(akt_activation, 1),
                "metabolic_ampk": round(metabolic_activation, 1)
            },
            "graph": {
                "nodes": nodes_data,
                "edges": edges_data
            }
        }
