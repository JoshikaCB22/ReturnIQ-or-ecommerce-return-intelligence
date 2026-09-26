#!/bin/bash

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Generate sample data
python generate_data.py

# Go back to root
cd ..

# Install frontend dependencies and build
cd frontend
npm install
npm run build

cd ..
