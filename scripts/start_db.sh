#!/bin/bash
set -e

SERVER="my_database_server";
PW="mysecretpassword";
DB="my_database";

echo "Stopping & removing old docker container [$SERVER] (if exists) and starting new instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5432:5432 \
  -d postgres

# Wait for PostgreSQL to start up by checking its logs
echo "Waiting for PostgreSQL server [$SERVER] to start..."
until docker exec -i $SERVER pg_isready -U postgres > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Create the database
echo "Creating database [$DB]..."
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres

# List all databases to verify
echo "Listing all databases:"
echo "\l" | docker exec -i $SERVER psql -U postgres
