@echo off
setlocal

set "ROOT=%~dp0"
set "DOCGEN=%ROOT%documentGeneration-master\docgen"
set "WEB=%ROOT%T2L-site-main"

echo.
echo  Turn2Law — starting services
echo  ════════════════════════════════════════
echo  Backend  :  http://127.0.0.1:8000
echo  Frontend :  http://127.0.0.1:3000
echo  Swagger  :  http://127.0.0.1:8000/docs
echo.

REM ── 1. Start FastAPI backend ───────────────────────────────────────────────
echo [1/2] Starting FastAPI backend...
start "Turn2Law DocGen API" /D "%DOCGEN%" cmd /k "..\.venv\Scripts\python.exe -m uvicorn api:app --host 127.0.0.1 --port 8000 --reload"

REM ── 2. Wait for backend to become reachable (max 30 s) ────────────────────
echo [2/2] Waiting for backend on port 8000...
set /a attempts=0
:WAIT_LOOP
timeout /t 2 /nobreak >nul
powershell -Command "try { $r = Invoke-WebRequest -Uri http://127.0.0.1:8000/api/templates -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% == 0 goto BACKEND_UP
set /a attempts+=1
if %attempts% geq 15 (
    echo.
    echo  WARNING: Backend did not respond after 30 s.
    echo  Check the "Turn2Law DocGen API" window for errors.
    echo  The frontend will still start — it will show a
    echo  "backend unavailable" message until the API is up.
    goto START_FRONTEND
)
goto WAIT_LOOP

:BACKEND_UP
echo  Backend is up ^(attempt %attempts%^).

:START_FRONTEND
REM ── 3. Start Next.js frontend ─────────────────────────────────────────────
echo.
echo  Starting Next.js frontend...
start "Turn2Law T2L Frontend" /D "%WEB%" cmd /k "npm run dev -- --hostname 127.0.0.1 --port 3000"

echo.
echo  Both services started.
echo  Open http://127.0.0.1:3000/dashboard when the frontend is ready.
echo.
