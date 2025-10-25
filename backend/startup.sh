#!/bin/bash

# Production startup script for Elite Soccer Player AI Coach Backend

set -e

echo "Starting Elite Soccer Player AI Coach Backend..."

# Check if required environment variables are set
if [ -z "$MONGO_URL" ]; then
    echo "Warning: MONGO_URL not set, using default: mongodb://localhost:27017"
    export MONGO_URL="mongodb://localhost:27017"
fi

if [ -z "$EMERGENT_LLM_KEY" ]; then
    echo "Warning: EMERGENT_LLM_KEY not set. LLM features may not work."
fi

if [ -z "$DB_NAME" ]; then
    echo "Using default database name: soccer_training_db"
    export DB_NAME="soccer_training_db"
fi

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until python -c "import pymongo; pymongo.MongoClient('$MONGO_URL').admin.command('ping')" 2>/dev/null; do
    echo "MongoDB is unavailable - sleeping"
    sleep 2
done
echo "MongoDB is ready!"

# Install emergentintegrations with special index
echo "Installing emergentintegrations..."
pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/ --quiet

# Start the application
echo "Starting FastAPI application on port ${PORT:-8001}..."
exec python -m uvicorn main:app \
    --host 0.0.0.0 \
    --port ${PORT:-8001} \
    --workers ${WORKERS:-1} \
    --access-log \
    --log-level ${LOG_LEVEL:-info}