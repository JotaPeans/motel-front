export type PaymentMethodType = "PIX" | "CREDITO" | "DEBITO" | "DINHEIRO";

export const paymentMethods = ["PIX", "CREDITO", "DEBITO", "DINHEIRO"];

export const paymentMethodMapping = {
  CREDITO: "credit",
  DEBITO: "debit",
  DINHEIRO: "cash",
};

export interface Payment {
  id: number;
  clienteId: number;
  reservaId: number;
  consumoId: number;
  forma_Pagamento: PaymentMethodType;
}
