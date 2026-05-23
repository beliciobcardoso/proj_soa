import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from model.service import Service
from registry.service_registry import ServiceRegistry
from consumer.client_consumer import ClientConsumer

# 1. Registry: repositório central que conecta provedores e consumidores
registry = ServiceRegistry()

# 2. Provider: registra seus serviços no registry
registry.register(Service("payment-service", "http://localhost:8080/payment"))
registry.register(Service("notification-service", "http://localhost:8081/notify"))

registry.list_all()

# 3. Consumer: descobre e consome serviços pelo registry (sem acoplamento direto)
print("=== Consumidor iniciando requisição ===")
consumer = ClientConsumer(registry)
consumer.consume_service()

# Testando serviço inexistente
print("\n=== Tentando consumir serviço inexistente ===")
empty_registry = ServiceRegistry()
another_consumer = ClientConsumer(empty_registry)
another_consumer.consume_service()
