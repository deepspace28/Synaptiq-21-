# Deployment Guide

This guide explains how to deploy both the Next.js frontend and the Python API backend.

## Prerequisites

- Node.js 18+
- Python 3.10+
- Docker (optional)
- Vercel account (optional, for frontend deployment)

## Python API Deployment

### Option 1: Local Deployment

1. Navigate to the API directory:
   \`\`\`
   cd api
   \`\`\`

2. Create a virtual environment:
   \`\`\`
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

4. Run the API:
   \`\`\`
   uvicorn quantum_service:app --host 0.0.0.0 --port 8000
   \`\`\`

### Option 2: Docker Deployment

1. Navigate to the API directory:
   \`\`\`
   cd api
   \`\`\`

2. Build the Docker image:
   \`\`\`
   docker build -t quantum-api .
   \`\`\`

3. Run the container:
   \`\`\`
   docker run -d --name quantum-api -p 8000:8000 -e PYTHON_API_KEY="your_secure_api_key" quantum-api
   \`\`\`

### Option 3: Cloud Deployment

The Python API can be deployed to cloud platforms like:

- **Heroku**:
  \`\`\`
  heroku create
  git push heroku main
  heroku config:set PYTHON_API_KEY="your_secure_api_key"
  \`\`\`

- **Google Cloud Run**:
  \`\`\`
  gcloud builds submit --tag gcr.io/your-project/quantum-api
  gcloud run deploy quantum-api --image gcr.io/your-project/quantum-api --platform managed
  \`\`\`

## Next.js Frontend Deployment

### Option 1: Local Deployment

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Build the application:
   \`\`\`
   npm run build
   \`\`\`

3. Start the server:
   \`\`\`
   npm start
   \`\`\`

### Option 2: Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Import the project in Vercel.

3. Configure the environment variables:
   - `PYTHON_API_URL`: URL of your deployed Python API
   - `PYTHON_API_KEY`: API key for authentication

4. Deploy the project.

## Environment Variables

Make sure to set these environment variables in your deployment environment:

- `PYTHON_API_URL`: URL of your Python API (e.g., "https://your-api-domain.com/execute")
- `PYTHON_API_KEY`: API key for authentication

## Testing the Deployment

1. Open your frontend application.

2. Navigate to the simulations page.

3. Enter a simulation prompt (e.g., "bell state").

4. Click "Run" and verify that the simulation executes correctly.

## Troubleshooting

- If you encounter CORS errors, make sure your Python API allows requests from your frontend domain.
- If authentication fails, check that the API key is correctly set in both environments.
- For execution errors, check the logs of your Python API service.
