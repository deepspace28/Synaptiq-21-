import json
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt
import io
import base64
import sys

def run_physics_simulation(system_type, parameters):
    """
    Runs a physics simulation based on the provided parameters
    
    Args:
        system_type (str): Type of physical system to simulate
        parameters (dict): Parameters for the simulation
        
    Returns:
        dict: Simulation results
    """
    try:
        if system_type == "harmonic_oscillator":
            return simulate_harmonic_oscillator(parameters)
        elif system_type == "projectile_motion":
            return simulate_projectile_motion(parameters)
        elif system_type == "pendulum":
            return simulate_pendulum(parameters)
        else:
            return {
                "success": False,
                "error": f"Unknown system type: {system_type}",
                "summary": "Physics simulation failed due to unknown system type"
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "summary": "Physics simulation failed due to an error"
        }

def simulate_harmonic_oscillator(parameters):
    """
    Simulates a harmonic oscillator
    
    Args:
        parameters (dict): Parameters for the simulation
        
    Returns:
        dict: Simulation results
    """
    # Extract parameters
    mass = parameters.get("mass", 1.0)
    spring_constant = parameters.get("spring_constant", 10.0)
    damping = parameters.get("damping", 0.1)
    initial_position = parameters.get("initial_position", 1.0)
    initial_velocity = parameters.get("initial_velocity", 0.0)
    time_span = parameters.get("time_span", (0, 10))
    num_points = parameters.get("num_points", 100)
    
    # Define the system of first-order ODEs
    def harmonic_oscillator(t, y):
        x, v = y
        dxdt = v
        dvdt = -spring_constant/mass * x - damping/mass * v
        return [dxdt, dvdt]
    
    # Initial conditions
    y0 = [initial_position, initial_velocity]
    
    # Solve the ODE
    t_eval = np.linspace(time_span[0], time_span[1], num_points)
    solution = solve_ivp(harmonic_oscillator, time_span, y0, t_eval=t_eval)
    
    # Extract results
    t = solution.t
    x = solution.y[0]  # position
    v = solution.y[1]  # velocity
    
    # Calculate energy
    potential_energy = 0.5 * spring_constant * x**2
    kinetic_energy = 0.5 * mass * v**2
    total_energy = potential_energy + kinetic_energy
    
    # Prepare chart data
    chart_data = {
        "type": "line",
        "labels": t.tolist(),
        "datasets": [
            {"label": "Position", "data": x.tolist()},
            {"label": "Velocity", "data": v.tolist()},
            {"label": "Total Energy", "data": total_energy.tolist()}
        ]
    }
    
    # Prepare table data
    table_rows = []
    for i in range(min(10, len(t))):  # Just include first 10 rows to keep output manageable
        table_rows.append([t[i], x[i], v[i], total_energy[i]])
    
    # Calculate period and frequency
    angular_frequency = np.sqrt(spring_constant / mass)
    period = 2 * np.pi / angular_frequency
    frequency = 1 / period
    
    # Prepare output
    output = {
        "success": True,
        "system_description": "Damped harmonic oscillator",
        "parameters": {
            "mass": mass,
            "spring_constant": spring_constant,
            "damping": damping,
            "initial_position": initial_position,
            "initial_velocity": initial_velocity
        },
        "results": {
            "key_values": {
                "period": period,
                "frequency": frequency,
                "angular_frequency": angular_frequency,
                "max_amplitude": np.max(np.abs(x)),
                "final_energy": total_energy[-1]
            },
            "time_series": {
                "time": t.tolist(),
                "position": x.tolist(),
                "velocity": v.tolist(),
                "energy": total_energy.tolist()
            }
        },
        "equations": [
            "\\frac{d^2x}{dt^2} + \\frac{c}{m}\\frac{dx}{dt} + \\frac{k}{m}x = 0",
            "\\omega = \\sqrt{\\frac{k}{m}}",
            "T = \\frac{2\\pi}{\\omega}"
        ],
        "chart_data": chart_data,
        "table_data": {
            "headers": ["Time", "Position", "Velocity", "Energy"],
            "rows": table_rows  {
            "headers": ["Time", "Position", "Velocity", "Energy"],
            "rows": table_rows
        }
    },
    "summary": f"Simulated a damped harmonic oscillator with mass {mass} kg, spring constant {spring_constant} N/m, and damping coefficient {damping} kg/s."
    }
    
    return output

def simulate_projectile_motion(parameters):
    """
    Simulates projectile motion
    
    Args:
        parameters (dict): Parameters for the simulation
        
    Returns:
        dict: Simulation results
    """
    # Extract parameters
    initial_velocity = parameters.get("initial_velocity", 10.0)
    launch_angle = parameters.get("launch_angle", 45.0)
    gravity = parameters.get("gravity", 9.81)
    air_resistance = parameters.get("air_resistance", 0.0)
    mass = parameters.get("mass", 1.0)
    time_span = parameters.get("time_span", (0, 5))
    num_points = parameters.get("num_points", 100)
    
    # Convert launch angle to radians
    launch_angle_rad = np.radians(launch_angle)
    
    # Initial velocity components
    v0x = initial_velocity * np.cos(launch_angle_rad)
    v0y = initial_velocity * np.sin(launch_angle_rad)
    
    # Define the system of first-order ODEs with air resistance
    def projectile_motion(t, y):
        x, vx, y_pos, vy = y
        
        # Calculate air resistance force
        v = np.sqrt(vx**2 + vy**2)
        F_air_x = -air_resistance * vx * v / mass if air_resistance > 0 else 0
        F_air_y = -air_resistance * vy * v / mass if air_resistance > 0 else 0
        
        dxdt = vx
        dvxdt = F_air_x
        dydt = vy
        dvydt = -gravity + F_air_y
        
        return [dxdt, dvxdt, dydt, dvydt]
    
    # Initial conditions
    y0 = [0, v0x, 0, v0y]
    
    # Solve the ODE
    t_eval = np.linspace(time_span[0], time_span[1], num_points)
    solution = solve_ivp(projectile_motion, time_span, y0, t_eval=t_eval)
    
    # Extract results
    t = solution.t
    x = solution.y[0]  # x position
    vx = solution.y[1]  # x velocity
    y = solution.y[2]  # y position
    vy = solution.y[3]  # y velocity
    
    # Find the index where the projectile hits the ground (y becomes negative)
    ground_index = np.argmax(y < 0) if any(y < 0) else len(y) - 1
    
    # Calculate range and maximum height
    projectile_range = x[ground_index] if ground_index < len(x) else x[-1]
    max_height = np.max(y)
    
    # Calculate energy
    kinetic_energy = 0.5 * mass * (vx**2 + vy**2)
    potential_energy = mass * gravity * y
    total_energy = kinetic_energy + potential_energy
    
    # Prepare chart data
    chart_data = {
        "type": "scatter",
        "labels": x.tolist()[:ground_index+1],
        "datasets": [
            {"label": "Trajectory", "data": y.tolist()[:ground_index+1]}
        ]
    }
    
    # Prepare table data
    table_rows = []
    for i in range(min(10, ground_index+1)):  # Just include first 10 rows to keep output manageable
        table_rows.append([t[i], x[i], y[i], np.sqrt(vx[i]**2 + vy[i]**2), total_energy[i]])
    
    # Prepare output
    output = {
        "success": True,
        "system_description": "Projectile motion",
        "parameters": {
            "initial_velocity": initial_velocity,
            "launch_angle": launch_angle,
            "gravity": gravity,
            "air_resistance": air_resistance,
            "mass": mass
        },
        "results": {
            "key_values": {
                "range": projectile_range,
                "max_height": max_height,
                "time_of_flight": t[ground_index] if ground_index < len(t) else t[-1]
            },
            "time_series": {
                "time": t.tolist()[:ground_index+1],
                "x_position": x.tolist()[:ground_index+1],
                "y_position": y.tolist()[:ground_index+1],
                "x_velocity": vx.tolist()[:ground_index+1],
                "y_velocity": vy.tolist()[:ground_index+1],
                "energy": total_energy.tolist()[:ground_index+1]
            }
        },
        "equations": [
            "x(t) = v_0 \\cos(\\theta) t",
            "y(t) = v_0 \\sin(\\theta) t - \\frac{1}{2}gt^2",
            "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
            "h_{max} = \\frac{v_0^2 \\sin^2(\\theta)}{2g}"
        ],
        "chart_data": chart_data,
        "table_data": {
            "headers": ["Time", "X Position", "Y Position", "Velocity", "Energy"],
            "rows": table_rows
        }
    },
    "summary": f"Simulated projectile motion with initial velocity {initial_velocity} m/s at {launch_angle} degrees."
    }
    
    return output

def simulate_pendulum(parameters):
    """
    Simulates a pendulum
    
    Args:
        parameters (dict): Parameters for the simulation
        
    Returns:
        dict: Simulation results
    """
    # Extract parameters
    length = parameters.get("length", 1.0)
    gravity = parameters.get("gravity", 9.81)
    initial_angle = parameters.get("initial_angle", 30.0)
    initial_angular_velocity = parameters.get("initial_angular_velocity", 0.0)
    damping = parameters.get("damping", 0.1)
    time_span = parameters.get("time_span", (0, 10))
    num_points = parameters.get("num_points", 100)
    
    # Convert initial angle to radians
    initial_angle_rad = np.radians(initial_angle)
    
    # Define the system of first-order ODEs
    def pendulum(t, y):
        theta, omega = y
        dtheta_dt = omega
        domega_dt = -gravity/length * np.sin(theta) - damping * omega
        return [dtheta_dt, domega_dt]
    
    # Initial conditions
    y0 = [initial_angle_rad, initial_angular_velocity]
    
    # Solve the ODE
    t_eval = np.linspace(time_span[0], time_span[1], num_points)
    solution = solve_ivp(pendulum, time_span, y0, t_eval=t_eval)
    
    # Extract results
    t = solution.t
    theta = solution.y[0]  # angle
    omega = solution.y[1]  # angular velocity
    
    # Convert angle to degrees for display
    theta_deg = np.degrees(theta)
    
    # Calculate energy
    kinetic_energy = 0.5 * length**2 * omega**2
    potential_energy = gravity * length * (1 - np.cos(theta))
    total_energy = kinetic_energy + potential_energy
    
    # Prepare chart data
    chart_data = {
        "type": "line",
        "labels": t.tolist(),
        "datasets": [
            {"label": "Angle (degrees)", "data": theta_deg.tolist()},
            {"label": "Angular Velocity", "data": omega.tolist()},
            {"label": "Total Energy", "data": total_energy.tolist()}
        ]
    }
    
    # Prepare table data
    table_rows = []
    for i in range(min(10, len(t))):  # Just include first 10 rows to keep output manageable
        table_rows.append([t[i], theta_deg[i], omega[i], total_energy[i]])
    
    # Calculate period for small oscillations
    small_angle_period = 2 * np.pi * np.sqrt(length / gravity)
    
    # Prepare output
    output = {
        "success": True,
        "system_description": "Pendulum",
        "parameters": {
            "length": length,
            "gravity": gravity,
            "initial_angle": initial_angle,
            "initial_angular_velocity": initial_angular_velocity,
            "damping": damping
        },
        "results": {
            "key_values": {
                "small_angle_period": small_angle_period,
                "max_angle": np.max(np.abs(theta_deg)),
                "final_energy": total_energy[-1]
            },
            "time_series": {
                "time": t.tolist(),
                "angle": theta_deg.tolist(),
                "angular_velocity": omega.tolist(),
                "energy": total_energy.tolist()
            }
        },
        "equations": [
            "\\frac{d^2\\theta}{dt^2} + \\frac{g}{L}\\sin(\\theta) + c\\frac{d\\theta}{dt} = 0",
            "T = 2\\pi\\sqrt{\\frac{L}{g}} \\text{ (small angle approximation)}"
        ],
        "chart_data": chart_data,
        "table_data": {
            "headers": ["Time", "Angle (degrees)", "Angular Velocity", "Energy"],
            "rows": table_rows
        }
    },
    "summary": f"Simulated a pendulum with length {length} m, initial angle {initial_angle} degrees, and damping coefficient {damping}."
    }
    
    return output

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())
    
    # Run simulation
    result = run_physics_simulation(
        input_data.get("system_type", "harmonic_oscillator"),
        input_data.get("parameters", {})
    )
    
    # Output result
    print(json.dumps(result))
