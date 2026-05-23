Exercício em sala
=================

- Cenário:
  - Sistema Hospitalar;
- Identifique possíveis serviços;
- Depois da identificação dos serviços, justifique a granularidade.
- Implemente um exemplo simples de comunicação entre dois serviços

Dois Domínios Simples — Sistema Hospitalar
=====================================

1) Domínio: Gestão de Pacientes
--------------------------------

- Descrição: Responsável pelas informações mestres do paciente (identidade, contato, dados demográficos e histórico básico).
- Serviços / responsabilidades:
  - Cadastro, leitura, atualização e exclusão (CRUD) de pacientes
  - Consulta de prontuários e histórico básico
  - Gestão de consentimentos e dados pessoais sensíveis
- Justificativa de granularidade: Coesão alta em torno da entidade paciente reduz duplicidade de dados e facilita governança (privacidade, consentimento). Mantemos o domínio relativamente compacto para evitar acoplamento com fluxos operacionais (ex.: leitos, agendamentos).

2) Domínio: Agendamento e Internação
------------------------------------

- Descrição: Gerencia a marcação de consultas/procedimentos, alocação de leitos, admissões, transferências e altas.
- Serviços / responsabilidades:
  - Agendamento de consultas e procedimentos
  - Reserva e liberação de leitos
  - Registro de admissão, transferência e alta
  - Disponibilidade de recursos (salas, equipamentos)
- Justificativa de granularidade: Foca nas operações de fluxo (capacidade e tempo). Separar este domínio do de pacientes permite escalabilidade operacional e políticas próprias (priorização, regras de alta) sem misturar dados mestres.

Integração entre domínios
------------------------

- Troca por APIs e eventos: ex.: quando o `Gestão de Pacientes` atualiza dados, emite evento `PacienteAtualizado`; `Agendamento e Internação` consome para manter informações de contato atualizadas.
- Motivação arquitetural: Contextos claros, menor acoplamento, possibilidade de escalar independentemente e aplicar políticas de segurança distintas.

---

Exemplo de Comunicação entre os Dois Serviços
==============================================

Arquivos: `typescript/src/hospital/pacienteService.ts` (porta 5001) e `typescript/src/hospital/agendamentoService.ts` (porta 5002).

Diagrama de sequência
---------------------

```
Cliente HTTP          Agendamento (5002)       Gestão de Pacientes (5001)
     |                       |                            |
     |  POST /agendamentos   |                            |
     |  {paciente_id: "1"}   |                            |
     |---------------------->|                            |
     |                       |  GET /pacientes/1          |
     |                       |--------------------------->|
     |                       |  200 {nome: "João Silva"}  |
     |                       |<---------------------------|
     |                       |                            |
     |  201 {agendamento}    |                            |
     |<----------------------|                            |
```

Serviço 1 — Gestão de Pacientes (`pacienteService.ts`)
------------------------------------------------------

```typescript
import express, { Request, Response } from "express";

interface Paciente {
  id: string;
  nome: string;
  contato: string;
}

const app = express();
app.use(express.json());

const pacientes: Record<string, Paciente> = {
  "1": { id: "1", nome: "João Silva",   contato: "joao@hospital.com" },
  "2": { id: "2", nome: "Maria Santos", contato: "maria@hospital.com" },
};

app.get("/pacientes/:id", (req: Request, res: Response) => {
  const paciente = pacientes[req.params.id];
  if (!paciente) {
    res.status(404).json({ erro: "Paciente não encontrado" });
    return;
  }
  res.json(paciente);
});

app.listen(5001, () => console.log("[GestãoPacientes] http://localhost:5001"));
```

Serviço 2 — Agendamento e Internação (`agendamentoService.ts`)
--------------------------------------------------------------

```typescript
import express, { Request, Response } from "express";

interface Agendamento {
  id: number;
  pacienteNome: string;
  data: string;
  procedimento: string;
  status: "confirmado" | "cancelado";
}

const app = express();
app.use(express.json());

const PACIENTE_SERVICE_URL = "http://localhost:5001";
const agendamentos: Agendamento[] = [];

app.post("/agendamentos", async (req: Request, res: Response) => {
  const { paciente_id, data, procedimento } = req.body;

  // Comunicação inter-serviço: valida o paciente antes de agendar
  const pacienteResp = await fetch(`${PACIENTE_SERVICE_URL}/pacientes/${paciente_id}`);
  if (!pacienteResp.ok) {
    res.status(404).json({ erro: `Paciente ${paciente_id} não encontrado` });
    return;
  }

  const paciente = await pacienteResp.json() as { nome: string };
  const agendamento: Agendamento = {
    id: agendamentos.length + 1,
    pacienteNome: paciente.nome,
    data,
    procedimento,
    status: "confirmado",
  };

  agendamentos.push(agendamento);
  res.status(201).json(agendamento);
});

app.listen(5002, () => console.log("[Agendamento] http://localhost:5002"));
```

Como executar
-------------

```bash
# Instalar dependências (apenas na primeira vez)
cd typescript
npm install

# Terminal 1 — inicia o serviço de pacientes
npx ts-node src/hospital/pacienteService.ts

# Terminal 2 — inicia o serviço de agendamento
npx ts-node src/hospital/agendamentoService.ts

# Terminal 3 — testa a comunicação entre os serviços
curl -s -X POST http://localhost:5002/agendamentos \
  -H "Content-Type: application/json" \
  -d '{"paciente_id": "1", "data": "2026-06-01", "procedimento": "Consulta Clínica"}'
```

Resposta esperada:

```json
{
  "id": 1,
  "pacienteNome": "João Silva",
  "data": "2026-06-01",
  "procedimento": "Consulta Clínica",
  "status": "confirmado"
}
```

Ponto-chave SOA
---------------

O serviço de `Agendamento` **não conhece** a estrutura interna de `Gestão de Pacientes` — ele apenas chama a API REST exposta. Isso garante o desacoplamento: cada serviço pode evoluir, escalar ou ser substituído de forma independente.
