// Provedor do serviço de pagamento — expõe a lógica de negócio como serviço
export class PaymentProvider {
    processPayment(amount: number = 100.0, clientId: string = "cliente-padrão"): string {
        console.log(`  [PaymentProvider] Processando pagamento de R$ ${amount} para ${clientId}`);
        return `Pagamento de R$ ${amount} processado com sucesso para o cliente: ${clientId}`;
    }
}
