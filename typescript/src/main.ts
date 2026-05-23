import { ServiceRegistry } from "./registry/ServiceRegistry";
import { ClientConsumer } from "./consumer/ClientConsumer";
import { Service } from "./model/Service";

// 1. Registry: repositório central que conecta provedores e consumidores
const registry = new ServiceRegistry();

// 2. Provider: registra seus serviços no registry
registry.register(new Service("payment-service", "http://localhost:8080/payment"));
registry.register(new Service("notification-service", "http://localhost:8081/notify"));

registry.listAll();

// 3. Consumer: descobre e consome serviços pelo registry (sem acoplamento direto)
console.log("=== Consumidor iniciando requisição ===");
const consumer = new ClientConsumer(registry);
consumer.consumeService();

// Testando serviço inexistente
console.log("\n=== Tentando consumir serviço inexistente ===");
const emptyRegistry = new ServiceRegistry();
const anotherConsumer = new ClientConsumer(emptyRegistry);
anotherConsumer.consumeService();
