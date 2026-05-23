import Registry.ServiceRegistry;
import Provider.PaymentProvider;
import Consumer.ClientConsumer;
import model.Service;

public class Main {
    public static void main(String[] args) {

        // 1. Registry: repositório central que conecta provedores e consumidores
        ServiceRegistry registry = new ServiceRegistry();

        // 2. Provider: registra seus serviços no registry
        registry.register(new Service("payment-service", "http://localhost:8080/payment"));
        registry.register(new Service("notification-service", "http://localhost:8081/notify"));

        registry.listAll();

        // 3. Consumer: descobre e consome serviços pelo registry (sem acoplamento direto)
        System.out.println("=== Consumidor iniciando requisição ===");
        ClientConsumer consumer = new ClientConsumer(registry);
        consumer.consumeService();

        // Testando serviço inexistente
        System.out.println("\n=== Tentando consumir serviço inexistente ===");
        ServiceRegistry emptyRegistry = new ServiceRegistry();
        ClientConsumer anotherConsumer = new ClientConsumer(emptyRegistry);
        anotherConsumer.consumeService();
    }
}
