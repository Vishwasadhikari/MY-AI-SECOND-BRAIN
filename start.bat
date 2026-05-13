@echo off
echo.
echo 🧠 Starting MY-AI-SECOND-BRAIN...
echo.

echo 📦 Installing Python dependencies...
cd backend
pip install -r requirements.txt -q

echo 🚀 Starting FastAPI backend on port 8000...
start "MY-AI-SECOND-BRAIN Backend" cmd /k "uvicorn main:app --reload --port 8000"

cd ..\frontend

echo 📦 Installing Node dependencies...
call npm install --silent

echo ⚛️  Starting React frontend on port 3000...
echo.
echo ✅ Both services starting!
echo    - Frontend: http://localhost:3000
echo    - Backend:  http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo.

start "MY-AI-SECOND-BRAIN Frontend" cmd /k "npm start"

echo Both services are starting in separate windows!
pause
