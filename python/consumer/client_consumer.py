from registry.service_registry import ServiceRegistry
from provider.payment_provider import PaymentProvider


# Consumidor — não conhece o provedor diretamente, usa o Registry
class ClientConsumer:
    def __init__(self, registry: ServiceRegistry) -> None:
        self._registry = registry

    def consume_service(self) -> None:
        service = self._registry.find("payment-service")

        if service is None:
            print("Serviço não encontrado!")
            return

        print(f"Serviço encontrado: {service.endpoint}")

        provider = PaymentProvider()
        response = provider.process_payment()

        print(response)
