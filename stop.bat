@echo off
echo ========================================================
echo Menghentikan AUDIRA-AssetHub...
echo ========================================================

echo.
echo Menghentikan Frontend (Port 3412)...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3412') DO (
    IF NOT "%%T"=="0" (
        echo Mematikan PID: %%T
        taskkill /F /PID %%T 2>NUL
    )
)

echo.
echo Menghentikan Backend API (Port 3413)...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3413') DO (
    IF NOT "%%T"=="0" (
        echo Mematikan PID: %%T
        taskkill /F /PID %%T 2>NUL
    )
)

echo.
echo ========================================================
echo Semua proses yang menggunakan port 3412 dan 3413 telah dihentikan.
echo ========================================================
pause
