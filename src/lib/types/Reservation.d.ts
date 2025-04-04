import { RoomStatus, RoomTipo } from "./Room";

export type ReservationStatus = "CONFIRMADA" | "CANCELADA" | "FINALIZADA";


export interface Reservation {
  readonly id: number;
  status: ReservationStatus;
  readonly data: Date;

  funcionarioId: number;
  clienteId: number;
  quartoId: number;

  readonly cliente_nome: string;
  readonly quarto_numero: string;
  readonly quarto_tipo: RoomTipo;
  readonly quarto_status: RoomStatus;
}