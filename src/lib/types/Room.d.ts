export interface Room {
  id: number;
  numero: number;
  tipo: "DELUXE" | "SUITE";
  status: "OCUPADO" | "DISPONIVEL" | "MANUTENCAO" | "RESERVADO" | "LIMPEZA";
}
