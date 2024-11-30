#!/bin/bash

# Install the required dependencies
echo "Instalando dependências..."
npm install

# Checks if the .env file exists, if not, displays an error message
if [ ! -f .env ]; then
    echo ".env file not found. Please create the .env file first."
    exit 1
fi

echo "Iniciando o processo de construção e execução do Docker..."

# Start containers in the background (detached mode)
echo "Construindo a imagem Docker e Iniciando os contêineres Docker..."
docker-compose up -d --build

# Check if containers are running
echo "Verificando contêineres em execução..."
docker ps

echo "Projeto iniciado com sucesso!"
