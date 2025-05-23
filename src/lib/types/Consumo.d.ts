export interface Consumo {
  id: number;
  produtoId: number | null;
  servicoId: number | null;
  clienteId: number;
  data_consumo: string;
  quantidade: number;
  valor: number;
  cliente_nome: string;
  produto_nome: string;
  servico_nome: string;
}