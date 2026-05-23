import { Service } from "../model/Service";

// Registro central de serviços — coração da arquitetura SOA
export class ServiceRegistry {
    private services = new Map<string, Service>();

    register(service: Service): void {
        this.services.set(service.name, service);
        console.log(`Serviço registrado: ${service.name} -> ${service.endpoint}`);
    }

    find(serviceName: string): Service | undefined {
        return this.services.get(serviceName);
    }

    listAll(): void {
        console.log("\n--- Serviços disponíveis no Registry ---");
        this.services.forEach((service, name) => {
            console.log(`  [${name}] -> ${service.endpoint}`);
        });
        console.log("----------------------------------------\n");
    }
}
