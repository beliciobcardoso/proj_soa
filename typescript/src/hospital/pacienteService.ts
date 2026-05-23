/**
 * Serviço 1 — Gestão de Pacientes
 * Porta: 5001
 */
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

app.get("/pacientes", (_req: Request, res: Response) => {
  res.json(Object.values(pacientes));
});

app.listen(5001, () => {
  console.log("[GestãoPacientes] Serviço iniciado em http://localhost:5001");
});
