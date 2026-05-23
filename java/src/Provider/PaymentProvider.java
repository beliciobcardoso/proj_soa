package Provider;

// Provedor do serviço de pagamento — expõe a lógica de negócio como serviço
public class PaymentProvider {

    public String processPayment() {
        return processPayment(100.0, "cliente-padrão");
    }

    public String processPayment(double amount, String clientId) {
        System.out.println("  [PaymentProvider] Processando pagamento de R$ " + amount + " para " + clientId);
        return "Pagamento de R$ " + amount + " processado com sucesso para o cliente: " + clientId;
    }
}
