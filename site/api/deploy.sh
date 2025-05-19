#!/bin/bash

# Build the Docker image
docker build -t quantum-api .

# Run the container
docker run -d \
  --name quantum-api \
  -p 8000:8000 \
  -e PYTHON_API_KEY="your_secure_api_key" \
  quantum-api

echo "Quantum API is running on http://localhost:8000"
