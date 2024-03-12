#!/bin/bash

# Executar o script SQL
psql -h localhost -U geoara -d geoara -f ./db/migrations/query.sql

# Executar o comando desejado
exec npm start
