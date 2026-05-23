"""
Serviço 1 — Gestão de Pacientes
Porta: 5001
"""
from flask import Flask, jsonify

app = Flask(__name__)

_pacientes = {
    "1": {"id": "1", "nome": "João Silva",   "contato": "joao@hospital.com"},
    "2": {"id": "2", "nome": "Maria Santos", "contato": "maria@hospital.com"},
}


@app.route("/pacientes/<paciente_id>")
def get_paciente(paciente_id):
    paciente = _pacientes.get(paciente_id)
    if not paciente:
        return jsonify({"erro": "Paciente não encontrado"}), 404
    return jsonify(paciente)


@app.route("/pacientes")
def listar_pacientes():
    return jsonify(list(_pacientes.values()))


if __name__ == "__main__":
    print("[GestãoPacientes] Serviço iniciado em http://localhost:5001")
    app.run(port=5001)
