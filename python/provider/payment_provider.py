# Provedor do serviço de pagamento — expõe a lógica de negócio como serviço
class PaymentProvider:
    def process_payment(self, amount: float = 100.0, client_id: str = "cliente-padrão") -> str:
        print(f"  [PaymentProvider] Processando pagamento de R$ {amount} para {client_id}")
        return f"Pagamento de R$ {amount} processado com sucesso para o cliente: {client_id}"
