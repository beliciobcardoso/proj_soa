package Consumer;

import model.Service;
import Provider.PaymentProvider;
import Registry.ServiceRegistry;

// Consumidor do serviço — não conhece o provedor diretamente, usa o Registry
public class ClientConsumer {
    private final ServiceRegistry registry;

    public ClientConsumer(ServiceRegistry registry) {
        this.registry = registry;
    }

    public void consumeService() {
        Service service = registry.find("payment-service");

        if (service == null) {
            System.out.println("Serviço não encontrado!");
            return;
        }

        System.out.println("Serviço encontrado: " + service.getEndpoint());

        PaymentProvider provider = new PaymentProvider();
        String response = provider.processPayment();

        System.out.println(response);
    }
}
