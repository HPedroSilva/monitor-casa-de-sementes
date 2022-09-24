import requests
import json
import serial

ser = serial.Serial("COM3")

while 1:
    a = ser.readline().decode()
    data = str(a).replace("\t","").replace("\r\n","").replace(" ","").split(",")
    dic = {"temperatura": float(data[2]), "umidade": float(data[1])}
    print(f"Dados enviados: {dic}")
    requisicao = requests.post("http://localhost:3000/insert", json=dic)
    print(f"Resposta da API: {requisicao.json()}")

ser.close()