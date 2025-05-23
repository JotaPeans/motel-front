import { Clock, User, Box } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Consumo as ConsumoType } from '@/lib/types/Consumo';

const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

interface ConsumoProps extends ConsumoType {}

export default function Consumo({ data_consumo, cliente_nome, produto_nome, servico_nome, quantidade, valor }: ConsumoProps) {
  const date = new Date(data_consumo);
  const label = produto_nome || servico_nome;
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-center pr-3">
            <div className="text-sm font-medium text-primary">
              {days[date.getDay()]}
            </div>
            <div className="text-3xl font-bold">{date.getDate()}</div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm text-zinc-300">
                    {format(date, 'kk:mm')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{cliente_nome}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm">
                    {label} <span className="font-semibold">x{quantidade}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-sm font-semibold">
                    {Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(valor)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}