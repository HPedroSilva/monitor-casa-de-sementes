import requests
import json
import serial

try:
    ser = serial.Serial("COM5")
except Exception as e:
    print(f'Erro ao conectar a porta serial: {e}')
else:
    while 1:
        a = ser.readline().decode()
        data = json.loads(a)
        print(data)
        try:
            res = requests.post("http://localhost:3000/insert", json=data)
        except Exception as e:
            print(f'Erro na requisição HTTP: {e}')
    ser.close()