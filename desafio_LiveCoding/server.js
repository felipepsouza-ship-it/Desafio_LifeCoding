const express = require('express');
const app = express();
const PORT = 1025;

app.use(express.json());

// Banco de dados em memoria
let tecnicos = [
    { id: 1, nome: "Carlos Silva", especialidade: "Redes" },
    { id: 2, nome: "Ana Souza", especialidade: "Sistemas" }
];

let chamados = [
    { id: 1, titulo: "Sem acesso a internet", descricao: "PC do setor financeiro sem rede", status: "ABERTO", tecnicoId: 1 },
    { id: 2, titulo: "Impressora travada", descricao: "Impressora da recepcao nao imprime", status: "EM_ANDAMENTO", tecnicoId: 2 }
];

let tecnicoIdCounter = 3;
let chamadoIdCounter = 3;

// ==========================================
// 1. ROTAS DO RECURSO: TECNICOS
// ==========================================

// GET /api/v1/tecnicos - Listar todos os tecnicos (Filtro por ?especialidade)
app.get('/api/v1/tecnicos', (req, res) => {
    const { especialidade } = req.query;
    if (especialidade) {
        const filtrados = tecnicos.filter(t => t.especialidade.toLowerCase() === especialidade.toLowerCase());
        return res.status(200).json(filtrados);
    }
    res.status(200).json(tecnicos);
});

// GET /api/v1/tecnicos/:id - Buscar tecnico por ID
app.get('/api/v1/tecnicos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tecnico = tecnicos.find(t => t.id === id);
    if (!tecnico) {
        return res.status(404).json({ erro: "Tecnico nao encontrado na base de dados." });
    }
    res.status(200).json(tecnico);
});

// POST /api/v1/tecnicos - Cadastrar novo tecnico
app.post('/api/v1/tecnicos', (req, res) => {
    const { nome, especialidade } = req.body;
    if (!nome || !especialidade) {
        return res.status(400).json({ erro: "Campos 'nome' e 'especialidade' sao obrigatorios." });
    }
    const novoTecnico = {
        id: tecnicoIdCounter++,
        nome,
        especialidade
    };
    tecnicos.push(novoTecnico);
    res.status(201).json(novoTecnico);
});

// PUT /api/v1/tecnicos/:id - Substituir dados do tecnico (Substituicao total)
app.put('/api/v1/tecnicos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, especialidade } = req.body;
    const tecnico = tecnicos.find(t => t.id === id);

    if (!tecnico) {
        return res.status(404).json({ erro: "Tecnico nao encontrado para substituicao." });
    }
    if (!nome || !especialidade) {
        return res.status(400).json({ erro: "Todos os campos ('nome' e 'especialidade') sao obrigatorios no PUT." });
    }

    tecnico.nome = nome;
    tecnico.especialidade = especialidade;

    res.status(200).json({ mensagem: "Tecnico atualizado com sucesso!", tecnico });
});

// PATCH /api/v1/tecnicos/:id/especialidade - Atualizar especialidade (Atualizacao parcial)
app.patch('/api/v1/tecnicos/:id/especialidade', (req, res) => {
    const id = parseInt(req.params.id);
    const { especialidade } = req.body;
    const tecnico = tecnicos.find(t => t.id === id);

    if (!tecnico) {
        return res.status(404).json({ erro: "Tecnico nao encontrado." });
    }
    if (!especialidade) {
        return res.status(400).json({ erro: "O campo 'especialidade' e obrigatorio." });
    }

    tecnico.especialidade = especialidade;
    res.status(200).json({ mensagem: "Especialidade atualizada com sucesso!", tecnico });
});

// DELETE /api/v1/tecnicos/:id - Remover tecnico
app.delete('/api/v1/tecnicos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tecnicos.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Tecnico nao encontrado." });
    }
    tecnicos.splice(index, 1);
    res.status(200).json({ mensagem: `Tecnico ID ${id} removido com sucesso.` });
});

// ==========================================
// 2. ROTAS DO RECURSO: CHAMADOS
// ==========================================

// GET /api/v1/chamados - Listar chamados (Filtros por ?status e ?tecnicoId)
app.get('/api/v1/chamados', (req, res) => {
    const { status, tecnicoId } = req.query;
    let resultado = chamados;

    if (status) {
        resultado = resultado.filter(c => c.status.toUpperCase() === status.toUpperCase());
    }

    if (tecnicoId) {
        resultado = resultado.filter(c => c.tecnicoId === parseInt(tecnicoId));
    }

    res.status(200).json(resultado);
});

// GET /api/v1/chamados/:id - Buscar chamado por ID
app.get('/api/v1/chamados/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const chamado = chamados.find(c => c.id === id);
    if (!chamado) {
        return res.status(404).json({ erro: "Chamado nao encontrado na base de dados." });
    }
    res.status(200).json(chamado);
});

// POST /api/v1/chamados - Abrir novo chamado
app.post('/api/v1/chamados', (req, res) => {
    const { titulo, descricao, tecnicoId } = req.body;
    if (!titulo || !descricao) {
        return res.status(400).json({ erro: "Campos 'titulo' e 'descricao' sao obrigatorios." });
    }

    if (tecnicoId) {
        const tecnicoExiste = tecnicos.some(t => t.id === parseInt(tecnicoId));
        if (!tecnicoExiste) {
            return res.status(400).json({ erro: "Tecnico informado nao existe na base de dados." });
        }
    }

    const novoChamado = {
        id: chamadoIdCounter++,
        titulo,
        descricao,
        status: "ABERTO",
        tecnicoId: tecnicoId ? parseInt(tecnicoId) : null
    };

    chamados.push(novoChamado);
    res.status(201).json(novoChamado);
});

// PUT /api/v1/chamados/:id - Substituir dados do chamado (Substituicao total)
app.put('/api/v1/chamados/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, descricao, status, tecnicoId } = req.body;
    const chamado = chamados.find(c => c.id === id);

    if (!chamado) {
        return res.status(404).json({ erro: "Chamado nao encontrado." });
    }
    if (!titulo || !descricao || !status) {
        return res.status(400).json({ erro: "Campos 'titulo', 'descricao' e 'status' sao obrigatorios no PUT." });
    }

    if (tecnicoId) {
        const tecnicoExiste = tecnicos.some(t => t.id === parseInt(tecnicoId));
        if (!tecnicoExiste) {
            return res.status(400).json({ erro: "Tecnico informado nao existe." });
        }
    }

    chamado.titulo = titulo;
    chamado.descricao = descricao;
    chamado.status = status.toUpperCase();
    chamado.tecnicoId = tecnicoId ? parseInt(tecnicoId) : null;

    res.status(200).json({ mensagem: "Chamado atualizado completamente!", chamado });
});

// PATCH /api/v1/chamados/:id/status - Atualizar status do chamado (Atualizacao parcial)
app.patch('/api/v1/chamados/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const chamado = chamados.find(c => c.id === id);

    if (!chamado) {
        return res.status(404).json({ erro: "Chamado nao encontrado." });
    }
    if (!status) {
        return res.status(400).json({ erro: "O campo 'status' e obrigatorio." });
    }

    chamado.status = status.toUpperCase();
    res.status(200).json({ mensagem: "Status atualizado com sucesso!", chamado });
});

// DELETE /api/v1/chamados/:id - Remover chamado
app.delete('/api/v1/chamados/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = chamados.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Chamado nao encontrado." });
    }
    chamados.splice(index, 1);
    res.status(200).json({ mensagem: `Chamado ID ${id} removido com sucesso.` });
});

// Inicializacao do servidor
app.listen(PORT, () => {
    console.log(`[Binario Tech] API de Chamados T.I. rodando em http://localhost:${PORT}`);
});
