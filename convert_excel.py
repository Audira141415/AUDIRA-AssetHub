import pandas as pd
import numpy as np

file_path = "Asset Register NuecentrIX Batam 2026.xlsx"
out_path = "Asset_Import_Ready.csv"

# Read excel with correct skiprows
df = pd.read_excel(file_path, sheet_name="Asset Register Batam", skiprows=2)

# Forward fill the columns that are likely merged in Excel
cols_to_ffill = ['Lokasi Data Center', 'Jenis Perangkat', 'Type', 'DC Hall yang disupply']
df[cols_to_ffill] = df[cols_to_ffill].ffill()

# Clean up empty rows based on the actual column name
df = df.dropna(subset=['Nama Asset (Sesuai Nama Asset di DCFC)'])

output_data = []
category_counters = {}

for index, row in df.iterrows():
    jenis = str(row.get('Jenis Perangkat', 'Unknown')).strip()
    
    # Simple mapping for Categories
    cat = jenis
    prefix = "UNK"
    
    if "PAC" in jenis.upper():
        cat = "Cooling PAC"
        prefix = "PAC"
    elif "GENSET" in jenis.upper():
        cat = "Genset"
        prefix = "GEN"
    elif "UPS" in jenis.upper():
        cat = "UPS"
        prefix = "UPS"
    elif "AC" in jenis.upper():
        cat = "AC Split"
        prefix = "ACS"
    elif "CCTV" in jenis.upper():
        cat = "CCTV Camera"
        prefix = "CCTV"
    elif "FIRE" in jenis.upper() or "FSS" in jenis.upper() or "APAR" in jenis.upper():
        cat = "Fire Suppression"
        prefix = "FSS"
    elif "RACK" in jenis.upper() or "RAK" in jenis.upper():
        cat = "Rack"
        prefix = "RCK"
    elif "DOOR" in jenis.upper() or "AKSES" in jenis.upper() or "ACCESS" in jenis.upper():
        cat = "Access Door"
        prefix = "ACC"
    elif "SENSOR" in jenis.upper() or "EMD" in jenis.upper():
        cat = "Environmental Sensor"
        prefix = "SNS"
    elif "PDU" in jenis.upper():
        cat = "PDU"
        prefix = "PDU"
    elif "RECTIFIER" in jenis.upper():
        cat = "Rectifier"
        prefix = "RCT"
    elif "BATTERY" in jenis.upper() or "BATERAI" in jenis.upper():
        cat = "Battery"
        prefix = "BAT"
    else:
        # Default mapping
        if len(jenis) > 3:
            prefix = jenis[:3].upper().replace(" ", "")
        else:
            prefix = jenis.upper()
            
    if prefix not in category_counters:
        category_counters[prefix] = 1
    else:
        category_counters[prefix] += 1
        
    tag = f"AST-BTM-{prefix}-{category_counters[prefix]:03d}"
    
    hostname = str(row['Nama Asset (Sesuai Nama Asset di DCFC)']).strip()
    
    loc = str(row.get('Lokasi Data Center', 'neuCentrIX Batam')).strip()
    if loc == 'nan':
        loc = "neuCentrIX Batam"
        
    room = str(row.get('DC Hall yang disupply', '-')).strip()
    if room == 'nan':
        room = str(row.get('Lantai ', '-')).strip()
        
    year = row.get('Tahun Perangkat Beroperasi', '')
    try:
        y = int(float(year))
        purchase_date = f"{y}-01-01"
    except:
        purchase_date = ""
        
    output_data.append({
        'tag': tag,
        'hostname': hostname,
        'category': cat,
        'location': loc,
        'rack': room,
        'uPosition': '-',
        'status': 'Active',
        'purchaseCost': '',
        'purchaseDate': purchase_date,
        'salvageValue': '',
        'usefulLifeYears': '10'
    })

out_df = pd.DataFrame(output_data)
out_df.to_csv(out_path, index=False)
print(f"Successfully converted {len(out_df)} rows to {out_path}!")
