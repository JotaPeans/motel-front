import { PaymentMethodType } from "./Payment";
import { RoomStatus, RoomTipo } from "./Room";

export type ReservationStatus = "CONFIRMADA" | "CANCELADA" | "FINALIZADA";


export interface Reservation {
  readonly id: number;
  status: ReservationStatus;
  readonly data_checkin: string;
  readonly data_checkout: string;

  funcionarioId: number;
  clienteId: number;
  quartoId: number;

  readonly cliente_nome: string;
  readonly quarto_numero: string;
  readonly quarto_tipo: RoomTipo;
  readonly quarto_status: RoomStatus;
  readonly quarto_preco: number;

  readonly forma_pagamento: PaymentMethodType;
}