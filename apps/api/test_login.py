import requests

response = requests.post(
    "http://127.0.0.1:3413/api/v1/auth/login",
    data={"username": "admin@audira.local", "password": "admin123"}
)

print(response.status_code)
print(response.json())
