#!/bin/bash

# Check if mongod is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    mongod --fork --logpath /dev/null
fi

# Start the backend server
echo "Starting backend server..."
cd backend && npm run dev 