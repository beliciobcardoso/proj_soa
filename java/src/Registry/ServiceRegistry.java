package Registry;

import model.Service;
import java.util.HashMap;
import java.util.Map;

// Registro central de serviços — coração da arquitetura SOA
public class ServiceRegistry {
    private final Map<String, Service> services = new HashMap<>();

    public void register(Service service) {
        services.put(service.getName(), service);
        System.out.println("Serviço registrado: " + service.getName() + " -> " + service.getEndpoint());
    }

    public Service find(String serviceName) {
        return services.get(serviceName);
    }

    public void listAll() {
        System.out.println("\n--- Serviços disponíveis no Registry ---");
        services.forEach((name, service) ->
            System.out.println("  [" + name + "] -> " + service.getEndpoint())
        );
        System.out.println("----------------------------------------\n");
    }
}
