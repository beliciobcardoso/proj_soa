"""
Serviço 2 — Agendamento e Internação
Porta: 5002

Comunicação inter-serviço: consulta o Serviço de Gestão de Pacientes (porta 5001)
antes de confirmar um agendamento.
"""
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

PACIENTE_SERVICE_URL = "http://localhost:5001"

_agendamentos: list[dict] = []


@app.route("/agendamentos", methods=["POST"])
def criar_agendamento():
    dados = request.get_json()
    paciente_id = dados.get("paciente_id")
    data = dados.get("data")
    procedimento = dados.get("procedimento")

    # --- Comunicação inter-serviço ---
    # Agendamento consulta Gestão de Pacientes para validar o paciente
    try:
        resp = requests.get(f"{PACIENTE_SERVICE_URL}/pacientes/{paciente_id}", timeout=3)
    except requests.ConnectionError:
        return jsonify({"erro": "Serviço de pacientes indisponível"}), 503

    if resp.status_code == 404:
        return jsonify({"erro": f"Paciente {paciente_id} não encontrado"}), 404

    paciente = resp.json()

    agendamento = {
        "id": len(_agendamentos) + 1,
        "paciente_id": paciente_id,
        "paciente_nome": paciente["nome"],
        "data": data,
        "procedimento": procedimento,
        "status": "confirmado",
    }
    _agendamentos.append(agendamento)
    print(f"[Agendamento] Consulta criada para {paciente['nome']} em {data}")
    return jsonify(agendamento), 201


@app.route("/agendamentos")
def listar_agendamentos():
    return jsonify(_agendamentos)


if __name__ == "__main__":
    print("[Agendamento] Serviço iniciado em http://localhost:5002")
    app.run(port=5002)
