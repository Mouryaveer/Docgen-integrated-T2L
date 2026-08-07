@echo off
setlocal

set "ROOT=%~dp0"
set "DOCGEN=%ROOT%documentGeneration-master\docgen"
set "WEB=%ROOT%T2L-site-main"

echo Starting Turn2Law DocGen API on http://127.0.0.1:8000
start "Turn2Law DocGen API" /D "%DOCGEN%" cmd /k "..\.venv\Scripts\python.exe -m uvicorn api:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Turn2Law Next.js frontend on http://127.0.0.1:3000/dashboard/doc-engine
start "Turn2Law T2L Frontend" /D "%WEB%" cmd /k "npm run dev -- --hostname 127.0.0.1 --port 3000"

echo.
echo Open http://127.0.0.1:3000/dashboard/doc-engine
