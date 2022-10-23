//INCLUSÃO DAS BIBLIOTECAS
#include <dht.h>
#include <ArduinoJson.h>

//INTERVALO DE LEITURA
#define intervalo 4000
//Quantidade de sensores conectados
#define nSensores 2
//Número dos pinos dos sensores (o id do sensor será o índice do sensor na lista + 1). Ex: o primeiro sensor na lista aparecerá no BD com o id 1.
const int  sensorPins[] = {7, 8};

//CRIANDO VARIAVEIS E INSTANCIANDO OBJETOS
const int capacity = JSON_ARRAY_SIZE(nSensores) + nSensores * JSON_OBJECT_SIZE(4);
StaticJsonDocument<capacity> doc;
unsigned long delayIntervalo;
dht sensorDHT;

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  if( (millis() - delayIntervalo) > intervalo ) {
    doc.clear();
    for(int i=0; i<nSensores; ++i){
      JsonObject leitura = doc.createNestedObject();
      int pinSensor = sensorPins[i];

      unsigned long start = micros();
      int chk = sensorDHT.read22(pinSensor);
      unsigned long stop = micros();

      leitura["sensorId"] = i + 1;
      switch (chk)
      {
        case DHTLIB_OK:
          leitura["erro"] = "OK";
          leitura["umidade"] = sensorDHT.humidity;
          leitura["temperatura"] = sensorDHT.temperature;
          break;
        case DHTLIB_ERROR_CHECKSUM:
          leitura["erro"] = "Checksum error";
          break;
        case DHTLIB_ERROR_TIMEOUT:
          leitura["erro"] = "Time out error";
          break;
        case DHTLIB_ERROR_CONNECT:
          leitura["erro"] = "Connect error";
          break;
        case DHTLIB_ERROR_ACK_L:
          leitura["erro"] = "Ack Low error";
          break;
        case DHTLIB_ERROR_ACK_H:
          leitura["erro"] = "Ack High error";
          break;
        default:
          leitura["erro"] = "Unknown error";
          break;
      }
    }
    serializeJson(doc, Serial);
    Serial.println();
    delayIntervalo = millis();
  }
}
