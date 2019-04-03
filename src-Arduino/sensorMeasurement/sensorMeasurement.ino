#include <DallasTemperature.h>

#include <OneWire.h>

#include <FreqCount.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <ArduinoJson.h>

#define DHTTYPE DHT11
#define WATERING_BTN_PIN 2
#define DELIMETER "\n"
#define WATERING_VALVE_PIN 40

const size_t capacity = JSON_OBJECT_SIZE(4) + 150;

volatile bool buttonDown = false;
volatile float buttonReleasedTimer;
volatile float buttonPressedTimer;
volatile float buttonDebounceTimer;
volatile bool debounced = false;

void confirmRequest(char* queueId){
  
  StaticJsonDocument<capacity> outputDoc;
  outputDoc["type"]="confirmation";
  outputDoc["queueId"] = queueId;
  Serial.println(outputDoc.as<String>());
  
}

void sendMeasurement(int pin, float data, char* queueId = NULL){

  StaticJsonDocument<capacity> outputDoc;
  outputDoc["pin"] = pin;
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

float measureAirTemperature(int pin){

  DHT dht(pin, DHT11);
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


float measureAirHumidity(int pin){

  DHT dht(pin, DHT11);
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

float measureSoilMoisture(int pin){
  
  FreqCount.begin(1000);
  
  float data;
  unsigned int waitCounter = 0;

  while (!FreqCount.available() && waitCounter < 20){
     delay(100);
     waitCounter++;
  }
  
  if (FreqCount.available()) {
    Serial.println("Moisture Sensor ready");
    data = FreqCount.read();
  } else {
    Serial.println("Moisture Sensor NOT ready");
  }

  FreqCount.end();

  return data;
  
}

float measureSoilTemperature(int pin){
  
  OneWire oneWirePin(pin);
  DallasTemperature sensor(&oneWirePin);

  pinMode(pin, INPUT);
  sensor.begin();

  delay(1000); // wait for sensor to start up
    
  sensor.requestTemperatures();

  float data = sensor.getTempCByIndex(0);

  Serial.print("Temperature: ");
  Serial.println(data);

  return data;
  
}

float measureLightIntensity(int pin){

  float data = analogRead(pin);

  return data;
  
}

void conductMeasurement( StaticJsonDocument<capacity> request){

  int pin = request["pin"];
  int type = request["sensorType"];
  char* queueId = request["queueId"];
  float data = 0.0f;

  switch(type){

    case 10:
      data = measureAirTemperature(pin);
      break;

    case 11:
      data = measureAirHumidity(pin);
      break;

    case 20: 
      data = measureSoilMoisture(pin);
      break;

    case 21:
      data = measureSoilTemperature(pin);
      break;

    case 30:
      data = measureLightIntensity(pin);
      break;
    
  }

  if(isnan(data)){
    sendError("Sensor responded with NaN", 500, queueId);
    return;
  }

  sendMeasurement(pin, data, queueId);
  
}

void toggleValve(bool openValve){

  digitalWrite(WATERING_VALVE_PIN, openValve);
  
}

void ISR_btnAction(){

  if(digitalRead(WATERING_BTN_PIN)){
    
    if(!buttonDown){
      buttonPressedTimer = millis();
    }
    buttonDown = true;
    debounced = false;
    toggleValve(true);
     
  } else {
    
    buttonReleasedTimer = millis();
    
  }

  
  
}


void setup() {

  Serial.begin(500000);
  attachInterrupt(digitalPinToInterrupt(WATERING_BTN_PIN), ISR_btnAction, CHANGE);
  pinMode(WATERING_BTN_PIN, INPUT);
  pinMode(WATERING_VALVE_PIN, OUTPUT);
    
}

void loop() {

  if( buttonDown && (digitalRead(WATERING_BTN_PIN) == LOW)){

    if(!debounced){
      buttonDebounceTimer = millis();
      debounced = true;
    }
    
    if((millis() > buttonDebounceTimer + 100)){
      buttonDown = false;
      toggleValve(false);
      int difference = (buttonReleasedTimer - buttonPressedTimer);
      sendMeasurement( WATERING_BTN_PIN, difference);   
    }
    
  }

  if(Serial.available()){
    int byteCount = 0;
    char _serialBuffer[capacity];
    // This is blocking - potentially adjust for non-blocking?
    byteCount = Serial.readBytesUntil(DELIMETER, _serialBuffer, capacity);
    if( byteCount > 0){
      
      StaticJsonDocument<capacity> inputDoc;
      DeserializationError error = deserializeJson(inputDoc, _serialBuffer);
      if(error){
        sendError(error.c_str(), 400);
      } else {
        confirmRequest(inputDoc["queueId"]);
        conductMeasurement(inputDoc);
      } 
    }
  }

}
