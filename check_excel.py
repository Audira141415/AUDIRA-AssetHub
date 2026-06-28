import pandas as pd

file_path = "Asset Register NuecentrIX Batam 2026.xlsx"
try:
    xl = pd.ExcelFile(file_path)
    print("Sheets:", xl.sheet_names)
    for sheet in xl.sheet_names:
        print(f"\n--- Sheet: {sheet} ---")
        df = pd.read_excel(file_path, sheet_name=sheet, nrows=5)
        print(df.to_string())
except Exception as e:
    print(f"Error: {e}")
