export const CONFIG = {

  // Path to folder where images are uploaded
  UPLOADS_DIR : process.env.UPLOADS_DIR || __dirname + "/../public/uploads",

  // Path to folder where images are uploaded
  PUBLIC_DIR : process.env.PUBLIC_DIR || __dirname + "/../public",

  // Path to folder where the built frontend is served from 
  FRONTEND_DIR : process.env.FRONTEND_DIR || __dirname + "/../frontend/dist",

  // On which Port the webserver should listen 
  WEBSERVER_PORT : process.env.NODE_PORT || 8080,
  
  SERIAL_MANAGER_PORT : process.env.SERIAL_MANAGER_PORT || 8081,

  SENSOR_CRON_PORT : process.env.SENSOR_CRON_PORT || 8082,

  ARDUINO_PORT : process.env.ARDUINO_PORT || '/dev/tty.usbmodem14201',

  ARDUINO_BAUD_RATE : +process.env.ARDUINO_BAUD_RATE || 500000

}