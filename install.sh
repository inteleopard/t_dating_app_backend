#!/bin/bash

# navigate to the shared directory
cd shared

# install the packages for the shared project
echo "Installing packages for shared project..."
yarn install

# create a symlink for the shared project
echo "Linking shared project..."
yarn link

# navigate to the core directory
cd ../core

# install the packages for the core project
echo "Installing packages for core project..."
yarn install

# link the shared project to the core project
echo "Linking shared project to core project..."
yarn link @appetism/binant-codetest-shared

# navigate to the events directory
cd ../events

# install the packages for the events project
echo "Installing packages for events project..."
yarn install

# link the shared project to the events project
echo "Linking shared project to events project..."
yarn link @appetism/binant-codetest-shared

echo "Setup done!"
echo "You can run 'docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build' to start the project"
