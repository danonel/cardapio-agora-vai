#!/bin/bash

# Open a new terminal tab and run the API
gnome-terminal --tab --working-directory="$(pwd)/api-cardap.io" -- bash -c "npm run dev; exec bash"

# Open another terminal tab and run the React app
gnome-terminal --tab --working-directory="$(pwd)/cardap.io" -- bash -c "npm run dev; exec bash"