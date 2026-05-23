import { ServiceRegistry } from "../registry/ServiceRegistry";
import { PaymentProvider } from "../provider/PaymentProvider";

// Consumidor — não conhece o provedor diretamente, usa o Registry
export class ClientConsumer {
    constructor(private readonly registry: ServiceRegistry) {}

    consumeService(): void {
        const service = this.registry.find("payment-service");

        if (!service) {
            console.log("Serviço não encontrado!");
            return;
        }

        console.log(`Serviço encontrado: ${service.endpoint}`);

        const provider = new PaymentProvider();
        const response = provider.processPayment();

        console.log(response);
    }
}
