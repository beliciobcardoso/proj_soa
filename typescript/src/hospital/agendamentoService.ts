/**
 * Serviço 2 — Agendamento e Internação
 * Porta: 5002
 *
 * Comunicação inter-serviço: consulta o Serviço de Gestão de Pacientes (porta 5001)
 * antes de confirmar um agendamento.
 */
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

  // --- Comunicação inter-serviço ---
  // Agendamento consulta Gestão de Pacientes para validar o paciente
  let pacienteResp: Response | globalThis.Response;
  try {
    pacienteResp = await fetch(`${PACIENTE_SERVICE_URL}/pacientes/${paciente_id}`);
  } catch {
    res.status(503).json({ erro: "Serviço de pacientes indisponível" });
    return;
  }

  if (!pacienteResp.ok) {
    res.status(404).json({ erro: `Paciente ${paciente_id} não encontrado` });
    return;
  }

  const paciente = await (pacienteResp as globalThis.Response).json() as { nome: string };

  const agendamento: Agendamento = {
    id: agendamentos.length + 1,
    pacienteNome: paciente.nome,
    data,
    procedimento,
    status: "confirmado",
  };

  agendamentos.push(agendamento);
  console.log(`[Agendamento] Consulta criada para ${paciente.nome} em ${data}`);
  res.status(201).json(agendamento);
});

app.get("/agendamentos", (_req: Request, res: Response) => {
  res.json(agendamentos);
});

app.listen(5002, () => {
  console.log("[Agendamento] Serviço iniciado em http://localhost:5002");
});
