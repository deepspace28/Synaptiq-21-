import json
import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import io
import base64
import sys

def run_quantum_simulation(circuit_description, num_qubits, gates, shots=1024):
    """
    Runs a quantum simulation based on the provided parameters
    
    Args:
        circuit_description (str): Description of the circuit
        num_qubits (int): Number of qubits in the circuit
        gates (list): List of gates to apply
        shots (int): Number of shots for the simulation
        
    Returns:
        dict: Simulation results
    """
    try:
        # Create quantum circuit
        qc = QuantumCircuit(num_qubits, num_qubits)
        
        # Apply gates
        for gate in gates:
            gate_type = gate["type"]
            targets = gate["targets"]
            
            if gate_type == "h":
                for target in targets:
                    qc.h(target)
            elif gate_type == "x":
                for target in targets:
                    qc.x(target)
            elif gate_type == "y":
                for target in targets:
                    qc.y(target)
            elif gate_type == "z":
                for target in targets:
                    qc.z(target)
            elif gate_type == "cx" or gate_type == "cnot":
                qc.cx(targets[0], targets[1])
            elif gate_type == "cz":
                qc.cz(targets[0], targets[1])
            elif gate_type == "ccx" or gate_type == "toffoli":
                qc.ccx(targets[0], targets[1], targets[2])
            elif gate_type == "measure":
                if len(targets) == 0:
                    qc.measure_all()
                else:
                    for i, target in enumerate(targets):
                        qc.measure(target, i)
        
        # If no measurements were added, add them
        if not any(op.name == 'measure' for op in qc.data):
            qc.measure_all()
        
        # Simulate
        simulator = Aer.get_backend('qasm_simulator')
        job = execute(qc, simulator, shots=shots)
        result = job.result()
        counts = result.get_counts(qc)
        
        # Convert counts to probabilities
        total_shots = sum(counts.values())
        probabilities = {state: count/total_shots for state, count in counts.items()}
        
        # Prepare chart data
        labels = list(counts.keys())
        values = list(counts.values())
        
        # Prepare table data
        table_rows = [[state, count, probabilities[state]] for state, count in counts.items()]
        
        # Prepare output
        output = {
            "success": True,
            "circuit_description": circuit_description,
            "num_qubits": num_qubits,
            "results": {
                "counts": counts,
                "probabilities": probabilities
            },
            "chart_data": {
                "type": "bar",
                "labels": labels,
                "values": values
            },
            "table_data": {
                "headers": ["State", "Count", "Probability"],
                "rows": table_rows
            },
            "summary": f"Quantum simulation of {circuit_description} completed successfully with {shots} shots."
        }
        
        return output
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "summary": "Quantum simulation failed due to an error"
        }

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())
    
    # Run simulation
    result = run_quantum_simulation(
        input_data.get("circuit_description", "Unknown circuit"),
        input_data.get("num_qubits", 2),
        input_data.get("gates", []),
        input_data.get("shots", 1024)
    )
    
    # Output result
    print(json.dumps(result))
