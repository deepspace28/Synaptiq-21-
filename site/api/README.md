# Quantum Simulation API

This is a Python API service for executing quantum simulations using Qiskit.

## Requirements

- Python 3.10+
- Docker (optional, for containerized deployment)

## Local Development

1. Create a virtual environment:
   \`\`\`
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

2. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

3. Run the API:
   \`\`\`
   uvicorn quantum_service:app --reload
   \`\`\`

4. The API will be available at http://localhost:8000

## Docker Deployment

1. Build the Docker image:
   \`\`\`
   docker build -t quantum-api .
   \`\`\`

2. Run the container:
   \`\`\`
   docker run -d --name quantum-api -p 8000:8000 -e PYTHON_API_KEY="your_secure_api_key" quantum-api
   \`\`\`

3. The API will be available at http://localhost:8000

## API Endpoints

### Execute Code

**POST /execute**

Execute Python code, primarily for quantum simulations using Qiskit.

**Request Body:**
\`\`\`json
{
  "code": "your_python_code_here",
  "engine": "qiskit"
}
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer your_api_key
\`\`\`

**Response:**
\`\`\`json
{
  "output": "json_output_from_execution"
}
\`\`\`

### Health Check

**GET /health**

Check if the API is running.

**Response:**
\`\`\`json
{
  "status": "healthy",
  "version": "1.0.0"
}
\`\`\`

## Environment Variables

- `PYTHON_API_KEY`: API key for authentication
- `PORT`: Port to run the API on (default: 8000)

## Security Considerations

- The API executes Python code, which can be a security risk. It's recommended to run this in a sandboxed environment.
- Always use a strong API key in production.
- In production, update the CORS settings to only allow requests from trusted origins.
\`\`\`

Let's update the environment variables in the Next.js app:
