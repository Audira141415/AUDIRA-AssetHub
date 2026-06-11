@echo off
echo ========================================================
echo Menyimpan Perubahan ke GitHub
echo ========================================================
echo.

:: Menambahkan semua perubahan ke dalam staging area
echo [1/3] Menambahkan file ke Git...
git add .

:: Meminta input untuk pesan commit
set /p commitMsg="Masukkan pesan commit (tekan Enter untuk 'Update changes'): "
if "%commitMsg%"=="" set commitMsg=Update changes

:: Melakukan commit dengan pesan yang diberikan
echo.
echo [2/3] Menyimpan commit...
git commit -m "%commitMsg%"

:: Mendorong (push) perubahan ke repository
echo.
echo [3/3] Mendorong ke GitHub (https://github.com/Audira141415/AUDIRA-AssetHub.git)...
git push origin main

echo.
echo ========================================================
echo Proses Selesai!
echo ========================================================
pause
