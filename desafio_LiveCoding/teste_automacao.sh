#!/bin/bash

LOG_FILE="resultado_execucao.log"
BASE_URL="http://localhost:3000/api/v1"

# Redireciona a saída do script para a tela e grava no arquivo de log
exec > >(tee -a "$LOG_FILE") 2>&1

echo "================================================================="
echo "   AUTOMACAO DE TESTES HTTP - SISTEMA DE CHAMADOS DE T.I.       "
echo "   DATA DE EXECUCAO: $(date)"
echo "================================================================="

echo -e "\n--- [1/12] GET /tecnicos (Listar todos os tecnicos) ---"
curl -s -X GET "$BASE_URL/tecnicos" | jq .

echo -e "\n--- [2/12] GET /tecnicos?especialidade=Redes (Filtrar por Query Param) ---"
curl -s -X GET "$BASE_URL/tecnicos?especialidade=Redes" | jq .

echo -e "\n--- [3/12] POST /tecnicos (Cadastrar novo tecnico - Status 201) ---"
curl -s -X POST "$BASE_URL/tecnicos" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Mariana Lima","especialidade":"Hardware"}' | jq .

echo -e "\n--- [4/12] POST /tecnicos (Teste de Validacao - Status 400 Bad Request) ---"
curl -s -i -X POST "$BASE_URL/tecnicos" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Incompleto"}'

echo -e "\n--- [5/12] PUT /tecnicos/1 (Substituir dados do tecnico ID 1) ---"
curl -s -X PUT "$BASE_URL/tecnicos/1" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carlos Silva Santos","especialidade":"Seguranca da Informacao"}' | jq .

echo -e "\n--- [6/12] PATCH /tecnicos/2/especialidade (Atualizacao parcial da especialidade) ---"
curl -s -X PATCH "$BASE_URL/tecnicos/2/especialidade" \
  -H "Content-Type: application/json" \
  -d '{"especialidade":"DevOps"}' | jq .

echo -e "\n--- [7/12] GET /chamados?status=ABERTO (Filtrar chamados por status) ---"
curl -s -X GET "$BASE_URL/chamados?status=ABERTO" | jq .

echo -e "\n--- [8/12] POST /chamados (Abrir novo chamado vinculado ao tecnico 3) ---"
curl -s -X POST "$BASE_URL/chamados" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Troca de monitor","descricao":"Tela piscando no setor comercial","tecnicoId":3}' | jq .

echo -e "\n--- [9/12] PATCH /chamados/1/status (Atualizar status do chamado 1 para EM_ANDAMENTO) ---"
curl -s -X PATCH "$BASE_URL/chamados/1/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"EM_ANDAMENTO"}' | jq .

echo -e "\n--- [10/12] GET /chamados/99 (Teste de Recurso Inexistente - Status 404 Not Found) ---"
curl -s -i -X GET "$BASE_URL/chamados/99"

echo -e "\n--- [11/12] DELETE /chamados/2 (Remover chamado ID 2) ---"
curl -s -X DELETE "$BASE_URL/chamados/2" | jq .

echo -e "\n--- [12/12] GET /chamados (Listagem final de chamados) ---"
curl -s -X GET "$BASE_URL/chamados" | jq .

echo -e "\n================================================================="
echo "   SUITE DE TESTES CONCLUIDA! LOG SALVO EM: $LOG_FILE           "
echo "================================================================="
