#!/bin/bash

echo "Building backend..."
tsc -p ./backend/tsconfig.json
echo "Backend built. Building frontend..."
cd ./frontend
ng build --prod
echo "Frontend build completed."
