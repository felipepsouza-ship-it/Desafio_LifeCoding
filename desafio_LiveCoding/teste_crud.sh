#!/bin/bash

# Captura a porta passada via parâmetro CLI (ex: ./teste_crud.sh 4000)
# Se não for informada, utiliza a porta 3000 como padrão
PORT=${1:-3000}
BASE_URL="http://localhost:${PORT}"
LOG_FILE="crud_result.log"

# Redireciona a saída do terminal (stdout e stderr) também para o arquivo de log
exec > >(tee "$LOG_FILE") 2>&1

echo "=== Executando Teste CRUD Dinâmico na URL: ${BASE_URL} ==="
echo "Data da execução: $(date)"

# ---------------------------------------------------------
# 1. POST - Cadastrar 1º Veículo
# ---------------------------------------------------------
echo -e "\n1. Criando o primeiro veículo (POST)..."
RESPONSE_1=$(curl -s -X POST "${BASE_URL}/api/v1/veiculos" \
  -H "Content-Type: application/json" \
  -d '{"placa": "ABC1234", "montadora": "Volkswagen", "modelo": "Gol", "status": "Ativo"}')

echo "Resposta do Servidor (POST 1): $RESPONSE_1"
ID_1=$(echo "$RESPONSE_1" | jq -r '.id')

if [ -z "$ID_1" ] \vert{}\vert{} [ "$ID_1" == "null" ]; then
  echo "Erro: Não foi possível obter o ID do primeiro veículo."
  exit 1
fi
echo "-> ID do Veículo 1 capturado via jq: ${ID_1}"

# ---------------------------------------------------------
# 2. POST - Cadastrar 2º Veículo
# ---------------------------------------------------------
echo -e "\n2. Criando o segundo veículo (POST)..."
RESPONSE_2=$(curl -s -X POST "${BASE_URL}/api/v1/veiculos" \
  -H "Content-Type: application/json" \
  -d '{"placa": "XYZ9876", "montadora": "Chevrolet", "modelo": "Onix", "status": "Ativo"}')

echo "Resposta do Servidor (POST 2): $RESPONSE_2"
ID_2=$(echo "$RESPONSE_2" | jq -r '.id')

if [ -z "$ID_2" ] \vert{}\vert{} [ "$ID_2" == "null" ]; then
  echo "Erro: Não foi possível obter o ID do segundo veículo."
  exit 1
fi
echo "-> ID do Veículo 2 capturado via jq: ${ID_2}"

# ---------------------------------------------------------
# 3. PATCH - Atualização Parcial do Veículo 1
# ---------------------------------------------------------
echo -e "\n3. Atualizando o status do veículo 1 (ID: ${ID_1}) (PATCH)..."
curl -s -X PATCH "${BASE_URL}/api/v1/veiculos/${ID_1}/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "Em Manutenção"}'
echo ""

# ---------------------------------------------------------
# 4. DELETE - Remoção do Veículo 2
# ---------------------------------------------------------
echo -e "\n4. Removendo o veículo 2 (ID: ${ID_2}) (DELETE)..."
curl -s -X DELETE "${BASE_URL}/api/v1/veiculos/${ID_2}"
echo ""

echo -e "\n=== Teste CRUD concluído com sucesso! Logs salvos em ${LOG_FILE} ==="
