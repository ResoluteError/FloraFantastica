export const CONFIG = {

  // Path to folder where images are uploaded
  UPLOADS_DIR :process.env.UPLOADS_DIR || "/Users/douglasreiser/Desktop/FloraFantastica/src-RPi/public/uploads",

  // Path to folder where images are uploaded
  PUBLIC_DIR :process.env.PUBLIC_DIR || "/Users/douglasreiser/Desktop/FloraFantastica/src-RPi/public/",

  // Path to folder where the built frontend is served from 
  FRONTEND_DIR : process.env.FRONTEND_DIR || "/Users/douglasreiser/Desktop/FloraFantastica/src-RPi/frontend/dist",

  // On which Port the webserver should listen 
  WEBSERVER_PORT : process.env.WEBSERVER_PORT || 8080,

  // On which Port the webserver should listen 
  WEBSERVER_HTTPS_PORT : process.env.WEBSERVER_HTTPS_PORT || 8443,
  
  QUEUE_MANAGER_PORT : process.env.QUEUE_MANAGER_PORT || 8081,

  PROD_MODE : process.env.PROD_MODE == "true" || false,

  AUTH : process.env.AUTH || "Bearer DUMMY",

  PASS : process.env.PASS || "DummyPass"
  
}