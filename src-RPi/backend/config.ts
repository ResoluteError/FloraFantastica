export const CONFIG = {

  // Path to folder where images are uploaded
  UPLOADS_DIR :process.env.UPLOADS_DIR || __dirname + "/../public/uploads",

  // Path to folder where images are uploaded
  PUBLIC_DIR :process.env.PUBLIC_DIR || __dirname + "/../public",

  // Path to folder where the built frontend is served from 
  FRONTEND_DIR : process.env.FRONTEND_DIR || __dirname + "/../frontend/dist",

  // On which Port to listen 
  NODE_PORT : process.env.NODE_PORT || 8080
  
}