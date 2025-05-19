from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import json
import traceback
import io
import sys
import contextlib

app = FastAPI(title="Quantum Simulation API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API key for authentication
API_KEY = os.environ.get("PYTHON_API_KEY", "default_key_for_development")

class CodeRequest(BaseModel):
    code: str
    engine: str = "qiskit"

def verify_api_key(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid API key",
        )
    
    api_key = auth_header.replace("Bearer ", "")
    if api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )
    
    return True

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/execute")
async def execute_code(request: CodeRequest, authenticated: bool = Depends(verify_api_key)):
    try:
        # Capture stdout to get the output
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        
        with contextlib.redirect_stdout(stdout_capture), contextlib.redirect_stderr(stderr_capture):
            # Execute the code
            exec(request.code, {"__builtins__": __builtins__})
        
        stdout_output = stdout_capture.getvalue()
        stderr_output = stderr_capture.getvalue()
        
        if stderr_output:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"error": f"Execution error: {stderr_output}"}
            )
        
        return {"output": stdout_output}
    except Exception as e:
        error_traceback = traceback.format_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Execution failed: {str(e)}\n{error_traceback}"}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
