//INCLUSÃO DAS BIBLIOTECAS
#include <dht.h>
#include <ArduinoJson.h>

//DEFINIÇÃO DE PINOS
#define pinSensor 7

//INTERVALO DE LEITURA
#define intervalo 4000

//CRIANDO VARIAVEIS E INSTANCIANDO OBJETOS
unsigned long delayIntervalo;
dht sensorDHT;
StaticJsonDocument<200> doc;

void setup()
{
  // INICIANDO MONITOR SERIAL  
  Serial.begin(9600);
}

void loop()
{ 
    if ( (millis() - delayIntervalo) > intervalo ) {
      doc.clear();
      //LEITURA DOS DADOS
      unsigned long start = micros();
      int chk = sensorDHT.read22(pinSensor);
      unsigned long stop = micros();

      doc["sensorId"] = 1;
      switch (chk)
      {
        case DHTLIB_OK:
					doc["erro"] = "OK";
					doc["umidade"] = sensorDHT.humidity;
					doc["temperatura"] = sensorDHT.temperature;
          break;
        case DHTLIB_ERROR_CHECKSUM:
          doc["erro"] = "Checksum error";
          break;
        case DHTLIB_ERROR_TIMEOUT:
          doc["erro"] = "Time out error";
          break;
        case DHTLIB_ERROR_CONNECT:
          doc["erro"] = "Connect error";
          break;
        case DHTLIB_ERROR_ACK_L:
          doc["erro"] = "Ack Low error";
          break;
        case DHTLIB_ERROR_ACK_H:
          doc["erro"] = "Ack High error";
          break;
        default:
          doc["erro"] = "Unknown error";
          break;
      }
  
      serializeJson(doc, Serial);
      Serial.println();
  
      delayIntervalo = millis();
    };
}
