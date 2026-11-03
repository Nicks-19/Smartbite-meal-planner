@echo off
title SmartBite - Leftover Meal Planner
echo =========================================================================
echo    SmartBite: Smart Leftover Meal Planner ^& Zero-Waste Kitchen
echo    Developer: Nikita Sharad Pawar ^| PRN: 202401100018
echo =========================================================================
echo.
echo [1/3] Checking Python environment...
python --version
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    pause
    exit /b 1
)

echo [2/3] Initializing SQLite database and verifying seed recipes...
python -c "import sys; sys.path.insert(0, '.'); from backend.app.database import init_db; from backend.app.seed_data import seed_database; init_db(); seed_database(); print('Database ready!')"

echo [3/3] Starting Full-Stack Server on http://127.0.0.1:8000 ...
echo.
echo -------------------------------------------------------------------------
echo   Web Application:     http://127.0.0.1:8000
echo   Swagger API Docs:    http://127.0.0.1:8000/docs
echo   Health Status:       http://127.0.0.1:8000/api/health
echo -------------------------------------------------------------------------
echo Press Ctrl+C in this terminal window to stop the server.
echo.

start "" "http://127.0.0.1:8000"
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
pause
