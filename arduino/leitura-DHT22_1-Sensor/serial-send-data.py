import requests
import json
import serial

ser = serial.Serial("COM5")

while 1:
    a = ser.readline().decode()
    data = json.loads(a)
    requisicao = requests.get("http://localhost:3000/test", json=data)

ser.close()