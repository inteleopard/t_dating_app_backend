#!/bin/bash
set -e

MONGO_HOST="mongodb"
MONGO_PORT="27017"
RETRIES=30

until echo 'db.runCommand({ping:1})' | mongo --quiet --host $MONGO_HOST --port $MONGO_PORT || [ $RETRIES -eq 0 ]; do
  echo "Waiting for MongoDB connection..."
  sleep 2
  RETRIES=$((RETRIES-1))
done

if [ $RETRIES -eq 0 ]; then
  echo "MongoDB is not available, exiting..."
  exit 1
fi

echo "MongoDB is ready, initiating replica set..."

mongo mongodb://${MONGO_HOST}:${MONGO_PORT} --eval "rs.initiate({ _id: 'rsmongo', members: [ { _id: 0, host: 'mongodb:27017' } ]})"

echo "Replica set initialized successfully."
