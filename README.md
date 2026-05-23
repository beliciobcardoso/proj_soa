# ProjetoSOA — Arquitetura Orientada a Serviços

Projeto didático que demonstra os conceitos fundamentais da **Arquitetura SOA (Service-Oriented Architecture)** em três linguagens diferentes, com o mesmo contexto e os mesmos papéis em cada uma.

---

## O que é SOA?

SOA é um estilo arquitetural onde funcionalidades do sistema são expostas como **serviços independentes**, que se comunicam por meio de interfaces bem definidas. Os três papéis centrais são:

```
Provider  →  publica serviço no  →  Registry
Consumer  →  descobre serviço no →  Registry  →  consome →  Provider
```

---

## Estrutura do Repositório

```
proj_soa/
├── java/           # Versão Java (JDK 11+)
├── typescript/     # Versão TypeScript (Node 18+)
└── python/         # Versão Python (3.10+)
```

Cada pasta contém a mesma arquitetura SOA implementada de forma idiomática para a linguagem.

---

## Os 3 Pilares da Arquitetura SOA

### Registry — Registro Central de Serviços
Catálogo que conecta provedores e consumidores. Provedores publicam seus serviços aqui; consumidores consultam para descobrir onde os serviços estão.

| Linguagem | Arquivo |
|---|---|
| Java | `java/src/Registry/ServiceRegistry.java` |
| TypeScript | `typescript/src/registry/ServiceRegistry.ts` |
| Python | `python/registry/service_registry.py` |

### Provider — Provedor de Serviço
Implementa a lógica de negócio e a expõe como um serviço com interface definida.

| Linguagem | Arquivo |
|---|---|
| Java | `java/src/Provider/PaymentProvider.java` |
| TypeScript | `typescript/src/provider/PaymentProvider.ts` |
| Python | `python/provider/payment_provider.py` |

### Consumer — Consumidor de Serviço
Descobre e consome serviços **sem acoplamento direto** ao provedor. Toda comunicação passa pelo Registry.

| Linguagem | Arquivo |
|---|---|
| Java | `java/src/Consumer/ClientConsumer.java` |
| TypeScript | `typescript/src/consumer/ClientConsumer.ts` |
| Python | `python/consumer/client_consumer.py` |

---

## Como Executar

### Python (sem dependências)
```bash
cd python
python3 main.py
```

### TypeScript
```bash
cd typescript
npm install
npx ts-node src/main.ts

# ou compilar e rodar:
npm run build
npm start
```

### Java (requer JDK 11+)
```bash
cd java
mkdir -p out
javac -d out -sourcepath src src/Main.java src/model/Service.java \
  src/Registry/ServiceRegistry.java \
  src/Provider/PaymentProvider.java \
  src/Consumer/ClientConsumer.java
java -cp out Main
```

---

## Saída esperada (igual nas 3 linguagens)

```
Serviço registrado: payment-service -> http://localhost:8080/payment
Serviço registrado: notification-service -> http://localhost:8081/notify

--- Serviços disponíveis no Registry ---
  [payment-service] -> http://localhost:8080/payment
  [notification-service] -> http://localhost:8081/notify
----------------------------------------

=== Consumidor iniciando requisição ===
Serviço encontrado: http://localhost:8080/payment
  [PaymentProvider] Processando pagamento de R$ 100.0 para cliente-padrão
Pagamento de R$ 100.0 processado com sucesso para o cliente: cliente-padrão

=== Tentando consumir serviço inexistente ===
Serviço não encontrado!
```

---

## Comparativo entre Linguagens

| Conceito SOA | Java | TypeScript | Python |
|---|---|---|---|
| Modelo de serviço | `class Service` | `class Service` | `@dataclass Service` |
| Registro central | `HashMap<String, Service>` | `Map<string, Service>` | `dict[str, Service]` |
| Tipagem | Estática | Estática | Type hints (PEP 484) |
| Descoberta | `registry.find()` | `registry.find()` | `registry.find()` |
| Acoplamento | Por interface | Por interface | Por duck typing |

---

## Princípios SOA Aplicados

| Princípio | Como foi aplicado |
|---|---|
| **Baixo acoplamento** | O Consumer não importa o Provider diretamente — depende do Registry |
| **Abstração** | O consumidor conhece apenas a interface (`endpoint`), não a implementação |
| **Reusabilidade** | O Registry aceita qualquer serviço; o Provider pode ser consumido por qualquer cliente |
| **Descoberta** | Serviços são localizados dinamicamente em tempo de execução |
| **Contrato** | A classe `Service` define o contrato (nome + endpoint) entre as partes |

---

## Referências

- [Wikipedia — Service-Oriented Architecture](https://en.wikipedia.org/wiki/Service-oriented_architecture)
- [Oracle Java Documentation](https://docs.oracle.com/en/java/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Python Type Hints — PEP 484](https://peps.python.org/pep-0484/)
