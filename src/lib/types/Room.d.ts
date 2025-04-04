export interface Room {
  id: number;
  numero: number;
  tipo: RoomTipo;
  status: RoomStatus;
  clienteNome: string | null;
}

export type RoomTipo = "DELUXE" | "SUITE";
export type RoomStatus = "OCUPADO" | "DISPONIVEL" | "MANUTENCAO" | "RESERVADO" | "LIMPEZA";
