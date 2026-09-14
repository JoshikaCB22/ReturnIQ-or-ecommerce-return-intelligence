@echo off
echo Setting up ReturnIQ - E-Commerce Return Risk Intelligence System
echo.

REM Backend setup
echo Setting up backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python generate_data.py
cd ..

REM Frontend setup
echo Setting up frontend...
cd frontend
call npm install
cd ..

echo.
echo Setup complete!
echo.
echo To start the application:
echo.
echo 1. Start backend (Terminal 1):
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn main:app --reload
echo.
echo 2. Start frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open http://localhost:5173 in your browser
echo.
pause
