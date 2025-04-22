export interface Room {
  id: number;
  numero: number;
  tipo: RoomTipo;
  status: RoomStatus;
  valor: number;
  clienteNome: string | null;
  reservaId: number;
}

export type RoomTipo = "DELUXE" | "SUITE";
export type RoomStatus = "OCUPADO" | "DISPONIVEL" | "MANUTENCAO" | "LIMPEZA";
