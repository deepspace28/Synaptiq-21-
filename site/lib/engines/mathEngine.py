import json
import sympy as sp
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
import sys

def run_symbolic_computation(problem_type, parameters):
    """
    Runs a symbolic computation based on the provided parameters
    
    Args:
        problem_type (str): Type of mathematical problem to solve
        parameters (dict): Parameters for the computation
        
    Returns:
        dict: Computation results
    """
    try:
        if problem_type == "equation_solving":
            return solve_equation(parameters)
        elif problem_type == "calculus":
            return perform_calculus(parameters)
        elif problem_type == "linear_algebra":
            return perform_linear_algebra(parameters)
        else:
            return {
                "success": False,
                "error": f"Unknown problem type: {problem_type}",
                "summary": "Symbolic computation failed due to unknown problem type"
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "summary": "Symbolic computation failed due to an error"
        }

def solve_equation(parameters):
    """
    Solves an equation symbolically
    
    Args:
        parameters (dict): Parameters for the equation solving
        
    Returns:
        dict: Computation results
    """
    # Extract parameters
    equation_str = parameters.get("equation", "x**2 + 2*x + 1 = 0")
    variable_str = parameters.get("variable", "x")
    
    # Parse equation
    if "=" in equation_str:
        lhs_str, rhs_str = equation_str.split("=")
        lhs = sp.sympify(lhs_str.strip())
        rhs = sp.sympify(rhs_str.strip())
        equation = lhs - rhs
    else:
        equation = sp.sympify(equation_str)
    
    # Define variable
    variable = sp.Symbol(variable_str)
    
    # Solve equation
    solutions = sp.solve(equation, variable)
    
    # Generate plot if possible
    chart_data = None
    if len(solutions) > 0 and all(sol.is_real for sol in solutions):
        # Try to plot the equation
        try:
            x_vals = np.linspace(-10, 10, 100)
            y_vals = [float(equation.subs(variable, val)) for val in x_vals]
            
            chart_data = {
                "type": "line",
                "labels": x_vals.tolist(),
                "datasets": [
                    {"label": f"f({variable_str})", "data": y_vals}
                ]
            }
        except:
            # If plotting fails, just continue without a plot
            pass
    
    # Prepare table data
    table_rows = []
    for i, sol in enumerate(solutions):
        table_rows.append([f"Solution {i+1}", str(sol), float(sol) if sol.is_real else "Complex"])
    
    # Prepare output
    output = {
        "success": True,
        "problem_description": f"Solving the equation {equation_str}",
        "variables": {
            variable_str: "Variable to solve for"
        },
        "results": {
            "symbolic_results": {
                "equation": str(equation),
                "solutions": [str(sol) for sol in solutions]
            },
            "numerical_results": {
                "num_solutions": len(solutions),
                "real_solutions": sum(1 for sol in solutions if sol.is_real)
            }
        },
        "equations": [
            f"{equation_str}",
            f"{variable_str} = " + ", ".join([str(sol) for sol in solutions])
        ],
        "chart_data": chart_data,
        "table_data": {
            "headers": ["Solution", "Symbolic", "Numeric"],
            "rows": table_rows
        },
        "summary": f"Solved the equation {equation_str} for {variable_str} and found {len(solutions)} solution(s)."
    }
    
    return output

def perform_calculus(parameters):
    """
    Performs calculus operations
    
    Args:
        parameters (dict): Parameters for the calculus operations
        
    Returns:
        dict: Computation results
    """
    # Extract parameters
    expression_str = parameters.get("expression", "x**2 + 2*x + 1")
    variable_str = parameters.get("variable", "x")
    operation = parameters.get("operation", "differentiate")
    
    # Parse expression
    expression = sp.sympify(expression_str)
    
    # Define variable
    variable = sp.Symbol(variable_str)
    
    # Perform operation
    if operation == "differentiate":
        result = sp.diff(expression, variable)
        operation_name = "Derivative"
        operation_latex = f"\\frac{{d}}{{d{variable_str}}}"
    elif operation == "integrate":
        result = sp.integrate(expression, variable)
        operation_name = "Integral"
        operation_latex = f"\\int"
    elif operation == "limit":
        point = parameters.get("point", 0)
        result = sp.limit(expression, variable, point)
        operation_name = f"Limit as {variable_str} approaches {point}"
        operation_latex = f"\\lim_{{{variable_str} \\to {point}}}"
    else:
        return {
            "success": False,
            "error": f"Unknown calculus operation: {operation}",
            "summary": "Calculus operation failed due to unknown operation type"
        }
    
    # Generate plot
    try:
        x_vals = np.linspace(-5, 5, 100)
        y_vals = [float(expression.subs(variable, val)) for val in x_vals]
        
        if operation == "differentiate":
            y_vals_result = [float(result.subs(variable, val)) for val in x_vals]
        else:
            y_vals_result = [float(result.subs(variable, val)) for val in x_vals]
        
        chart_data = {
            "type": "line",
            "labels": x_vals.tolist(),
            "datasets": [
                {"label": f"f({variable_str})", "data": y_vals},
                {"label": f"{operation_name}", "data": y_vals_result}
            ]
        }
    except:
        # If plotting fails, just continue without a plot
        chart_data = None
    
    # Prepare table data
    table_rows = []
    for i in range(0, 10):
        x_val = -5 + i
        try:
            f_val = float(expression.subs(variable, x_val))
            result_val = float(result.subs(variable, x_val))
            table_rows.append([x_val, f_val, result_val])
        except:
            continue
    
    # Prepare output
    output = {
        "success": True,
        "problem_description": f"Performing {operation} on {expression_str}",
        "variables": {
            variable_str: "Variable for calculus operation"
        },
        "results": {
            "symbolic_results": {
                "expression": str(expression),
                "result": str(result)
            },
            "numerical_results": {
                "value_at_0": float(result.subs(variable, 0)) if result.is_real else "Complex"
            }
        },
        "equations": [
            f"f({variable_str}) = {expression_str}",
            f"{operation_latex}[f({variable_str})] = {sp.latex(result)}"
        ],
        "chart_data": chart_data,
        "table_data": {
            "headers": [variable_str, f"f({variable_str})", operation_name],
            "rows": table_rows
        },
        "summary": f"Performed {operation} on {expression_str} with respect to {variable_str}."
    }
    
    return output

def perform_linear_algebra(parameters):
    """
    Performs linear algebra operations
    
    Args:
        parameters (dict): Parameters for the linear algebra operations
        
    Returns:
        dict: Computation results
    """
    # Extract parameters
    matrix_str = parameters.get("matrix", "[[1, 2], [3, 4]]")
    operation = parameters.get("operation", "eigenvalues")
    
    # Parse matrix
    matrix = sp.Matrix(eval(matrix_str))
    
    # Perform operation
    if operation == "eigenvalues":
        eigenvalues = matrix.eigenvals()
        eigenvectors = matrix.eigenvects()
        result = {"eigenvalues": eigenvalues, "eigenvectors": eigenvectors}
        operation_name = "Eigenvalues and Eigenvectors"
    elif operation == "determinant":
        result = matrix.det()
        operation_name = "Determinant"
    elif operation == "inverse":
        result = matrix.inv()
        operation_name = "Inverse"
    elif operation == "rank":
        result = matrix.rank()
        operation_name = "Rank"
    else:
        return {
            "success": False,
            "error": f"Unknown linear algebra operation: {operation}",
            "summary": "Linear algebra operation failed due to unknown operation type"
        }
    
    # Prepare table data
    table_rows = []
    if operation == "eigenvalues":
        for eigenvalue, multiplicity in eigenvalues.items():
            table_rows.append([str(eigenvalue), multiplicity])
    elif operation == "inverse":
        for i in range(result.rows):
            row = []
            for j in range(result.cols):
                row.append(float(result[i, j]))
            table_rows.append(row)
    
    # Prepare output
    output = {
        "success": True,
        "problem_description": f"Performing {operation} on matrix {matrix_str}",
        "variables": {
            "matrix": "Input matrix for linear algebra operation"
        },
        "results": {
            "symbolic_results": {
                "matrix": str(matrix),
                "result": str(result)
            },
            "numerical_results": {
                "dimensions": f"{matrix.rows}x{matrix.cols}"
            }
        },
        "equations": [
            f"A = {sp.latex(matrix)}",
            f"{operation_name}(A) = {sp.latex(result) if hasattr(result, 'rows') else str(result)}"
        ],
        "table_data": {
            "headers": ["Eigenvalue", "Multiplicity"] if operation == "eigenvalues" else [f"Column {i+1}" for i in range(result.cols)] if hasattr(result, 'cols') else ["Result"],
            "rows": table_rows
        },
        "summary": f"Performed {operation} on the given matrix."
    }
    
    return output

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())
    
    # Run computation
    result = run_symbolic_computation(
        input_data.get("problem_type", "equation_solving"),
        input_data.get("parameters", {})
    )
    
    # Output result
    print(json.dumps(result))
