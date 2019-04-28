#include <DallasTemperature.h>

#include <OneWire.h>

#include <FreqCount.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <ArduinoJson.h>

#define DHTTYPE DHT22
#define WATERING_BTN_PIN 2
#define WATERING_VALVE_PIN 22
#define DELIMETER "\n"
#define ON_LED_PIN 40
#define WATERING_LED_PIN 44
#define MEASURING_LED_PIN 48
#define AUTOPILOT_LED_PIN 52

#define JSON_BUFFER_SIZE 128

const size_t capacity = JSON_OBJECT_SIZE(4) + 100;

volatile bool watering = false;
volatile bool watered = false;
volatile unsigned long buttonReleasedTimer;
volatile unsigned long buttonPressedTimer;

void confirmRequest(char* queueId){
  
  StaticJsonDocument<capacity> outputDoc;
  outputDoc["type"]="confirmation";
  outputDoc["queueId"] = queueId;
  Serial.println(outputDoc.as<String>());
  
}

void sendMeasurement(int dataPin, float data, char* queueId = NULL){

  StaticJsonDocument<capacity> outputDoc;
  outputDoc["dataPin"] = dataPin;
  outputDoc["data"] = data;
  outputDoc["type"] = "measurement";
  outputDoc["queueId"] = queueId;
  Serial.println(outputDoc.as<String>());

}

void sendError( char* errorMsg, int code, char* queueId = NULL){
  
  StaticJsonDocument<capacity> outputDoc;
  outputDoc["code"] = code;
  outputDoc["error"] = errorMsg;
  outputDoc["type"] = "error";
  outputDoc["queueId"] = queueId;
  Serial.println(outputDoc.as<String>());
  
}

void sendBusy( bool busy ){
  
  StaticJsonDocument<capacity> outputDoc;
  outputDoc["type"] = "isBusy";
  outputDoc["busy"] = busy;
  
}

float measureAirTemperature(int dataPin){

  DHT dht(dataPin, DHTTYPE);
  dht.begin();
  float data;
  int i = 0;
  do {
    delay(10);
    data = dht.readTemperature();
    i++;
  } while( isnan(data) && i < 100 );

  return data;
  
}


float measureAirHumidity(int dataPin){

  DHT dht(dataPin, DHTTYPE);
  dht.begin();
  float data;
  int i = 0;
  do {
    delay(10);
    data = dht.readHumidity();
    i++;
  } while( isnan(data) && i < 100 );
  
  return data;
  
}

// dataPin is ignored because this sensor requires the specific timer pin 47
float measureSoilMoisture(int dataPin){
  
  FreqCount.begin(1000);
  
  float data;
  unsigned int waitCounter = 0;

  while (!FreqCount.available() && waitCounter < 20){
     delay(100);
     waitCounter++;
  }
  
  if (FreqCount.available()) {
    data = FreqCount.read();
  } 

  FreqCount.end();

  if(data == 0){
    data = sqrt(-1); // set NaN
  }

  return data;
  
}

float measureSoilTemperature(int dataPin){
  
  OneWire oneWirePin(dataPin);
  DallasTemperature sensor(&oneWirePin);

  pinMode(pin, INPUT);
  sensor.begin();

  delay(1000); // wait for sensor to start up
    
  sensor.requestTemperatures();

  float data = sensor.getTempCByIndex(0);

  if( data < -100){
    data = sqrt(-1);
  }

  return data;
  
}

float measureLightIntensity(int dataPin){

  float data = analogRead(dataPin);

  return data;
  
}

void conductMeasurement( StaticJsonDocument<capacity> request){

  int dataPin = request["dataPin"];
  int powerPin = request["powerPin"];
  int type = request["sensorType"];
  char* queueId = request["queueId"];
  float data = 0.0f;

  pinMode(powerPin, OUTPUT);
  digitalWrite(powerPin, HIGH);
  delay(1000);

  switch(type){

    case 10:
      data = measureAirTemperature(dataPin);
      break;

    case 11:
      data = measureAirHumidity(dataPin);
      break;

    case 20: 
      data = measureSoilMoisture(dataPin);
      break;

    case 21:
      data = measureSoilTemperature(dataPin);
      break;

    case 30:
      data = measureLightIntensity(dataPin);
      break;
    
  }
  
  digitalWrite(MEASURING_LED_PIN, LOW);

  if(isnan(data)){
    sendError("Sensor responded with NaN", 500, queueId);
    return;
  }
  
  sendMeasurement(dataPin, data, queueId);
  
}

void ISR_btnAction(){

  if(digitalRead(WATERING_BTN_PIN)){

    if(!watered && !watering){
      watering = true;
      watered = false;
      buttonPressedTimer = millis();
      digitalWrite(WATERING_VALVE_PIN, HIGH);
      digitalWrite(WATERING_LED_PIN, HIGH);
      return;
    }
    
    if(watering && buttonPressedTimer < millis() - 1000){
      watering = false;
      watered = true;
      buttonReleasedTimer = millis();
      digitalWrite(WATERING_VALVE_PIN, LOW);
      digitalWrite(WATERING_LED_PIN, LOW);
      return;
    }
     
  }
  
}

void readBuffer(){
  int byteCount = 0;
  
  char _serialBuffer[JSON_BUFFER_SIZE];
  memset(_serialBuffer, 0, JSON_BUFFER_SIZE);
  
  byteCount = Serial.readBytesUntil("\r\n", _serialBuffer, JSON_BUFFER_SIZE);
  if( byteCount > 0){
    DynamicJsonDocument inputDoc(capacity);
    DeserializationError error = deserializeJson(inputDoc, _serialBuffer);
    if(error){
      sendError(error.c_str(), 400);
    } else {
      digitalWrite(MEASURING_LED_PIN, HIGH);
      char* queueId = inputDoc["queueId"];
      confirmRequest(queueId);
      conductMeasurement(inputDoc);
    }
  }
}


void setup() {

  Serial.begin(500000);
  attachInterrupt(digitalPinToInterrupt(WATERING_BTN_PIN), ISR_btnAction, RISING);
  
  pinMode(WATERING_BTN_PIN, INPUT);
  pinMode(WATERING_VALVE_PIN, OUTPUT);
  
  pinMode(ON_LED_PIN, OUTPUT);
  digitalWrite(ON_LED_PIN, HIGH);
  
  pinMode(WATERING_LED_PIN, OUTPUT);
  digitalWrite(WATERING_LED_PIN, LOW);
  
  pinMode(MEASURING_LED_PIN, OUTPUT);
  digitalWrite(MEASURING_LED_PIN, LOW);
  
  pinMode(AUTOPILOT_LED_PIN, OUTPUT);
  digitalWrite(AUTOPILOT_LED_PIN, LOW);
  
  pinMode(WATERING_VALVE_PIN, OUTPUT);
  digitalWrite(WATERING_VALVE_PIN, LOW);
    
}

void loop() {

  if(watered){
    watered = false;
    int difference = (buttonReleasedTimer - buttonPressedTimer);
    sendMeasurement( WATERING_BTN_PIN, difference);   
  }
  
  if(Serial.available()){
    readBuffer();
  }


}
