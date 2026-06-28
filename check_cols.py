import pandas as pd

file_path = "Asset Register NuecentrIX Batam 2026.xlsx"
df = pd.read_excel(file_path, sheet_name="Asset Register Batam", skiprows=1)
print(df.columns.tolist())
