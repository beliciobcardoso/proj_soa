from typing import Optional
from model.service import Service


# Registro central de serviços — coração da arquitetura SOA
class ServiceRegistry:
    def __init__(self) -> None:
        self._services: dict[str, Service] = {}

    def register(self, service: Service) -> None:
        self._services[service.name] = service
        print(f"Serviço registrado: {service.name} -> {service.endpoint}")

    def find(self, service_name: str) -> Optional[Service]:
        return self._services.get(service_name)

    def list_all(self) -> None:
        print("\n--- Serviços disponíveis no Registry ---")
        for name, service in self._services.items():
            print(f"  [{name}] -> {service.endpoint}")
        print("----------------------------------------\n")
