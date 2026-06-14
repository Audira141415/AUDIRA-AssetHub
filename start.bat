@echo off
echo ========================================================
echo Memulai AUDIRA-AssetHub...
echo ========================================================
echo Membersihkan port yang mungkin tersangkut (3412, 3413)...
powershell -Command "$p1 = (Get-NetTCPConnection -LocalPort 3412 -ErrorAction SilentlyContinue).OwningProcess; if ($p1) { Stop-Process -Id $p1 -Force }; $p2 = (Get-NetTCPConnection -LocalPort 3413 -ErrorAction SilentlyContinue).OwningProcess; if ($p2) { Stop-Process -Id $p2 -Force }"
echo Frontend (Web) akan berjalan di: http://localhost:3412
echo Backend (API) akan berjalan di: http://localhost:3413
echo.
echo Menjalankan proses melalui Turborepo...
pnpm run dev
pause
