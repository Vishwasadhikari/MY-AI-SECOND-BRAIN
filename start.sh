#!/bin/bash

echo ""
echo "🧠 Starting MY-AI-SECOND-BRAIN..."
echo ""

# Start backend
echo "📦 Installing Python dependencies..."
cd backend
pip install -r requirements.txt -q

echo "🚀 Starting FastAPI backend on port 8000..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

cd ../frontend

echo "📦 Installing Node dependencies (this may take a minute)..."
npm install --silent

echo "⚛️  Starting React frontend on port 3000..."
echo ""
echo "✅ Both services starting!"
echo "   → Frontend: http://localhost:3000"
echo "   → Backend:  http://localhost:8000"
echo "   → API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services."
echo ""

npm start

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
echo "👋 MY-AI-SECOND-BRAIN stopped."
