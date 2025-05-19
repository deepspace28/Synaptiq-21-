from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import os
import json
import traceback
import logging
from contextlib import redirect_stdout
import io
import sys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("quantum-api")

# Initialize FastAPI app
app = FastAPI(title="Quantum Simulation API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API key security
API_KEY = os.environ.get("PYTHON_API_KEY", "default_dev_key")
api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

async def verify_api_key(api_key: str = Depends(api_key_header)):
    if not api_key:
        raise HTTPException(status_code=401, detail="Missing API key")
    
    # Extract the token from "Bearer {token}"
    if api_key.startswith("Bearer "):
        api_key = api_key[7:]
    
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

class CodeRequest(BaseModel):
    code: str
    engine: str = "qiskit"

@app.post("/execute")
async def execute_code(request: CodeRequest, api_key: str = Depends(verify_api_key)):
    """
    Execute Python code, primarily for quantum simulations using Qiskit.
    """
    logger.info(f"Received execution request for engine: {request.engine}")
    
    try:
        # Capture stdout to get print statements from the executed code
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        
        # Create a safe globals dictionary with necessary imports
        safe_globals = {
            "__builtins__": __builtins__,
            "print": print,
            "json": json,
        }
        
        # Add engine-specific imports
        if request.engine == "qiskit":
            try:
                import qiskit
                import numpy as np
                import matplotlib
                matplotlib.use('Agg')  # Use non-interactive backend
                import matplotlib.pyplot as plt
                from io import BytesIO
                import base64
                
                safe_globals.update({
                    "qiskit": qiskit,
                    "np": np,
                    "plt": plt,
                    "BytesIO": BytesIO,
                    "base64": base64,
                    "io": io,
                })
            except ImportError as e:
                return {"error": f"Required package not installed: {str(e)}"}
        
        # Execute the code
        with redirect_stdout(stdout_capture), redirect_stdout(stderr_capture):
            exec(request.code, safe_globals)
        
        # Get the output
        output = stdout_capture.getvalue()
        errors = stderr_capture.getvalue()
        
        if errors:
            logger.warning(f"Code execution produced errors: {errors}")
            return {"output": output, "errors": errors}
        
        logger.info("Code executed successfully")
        return {"output": output}
        
    except Exception as e:
        logger.error(f"Error executing code: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error executing code: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
