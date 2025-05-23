'use client';

import { useEffect, useState, useTransition } from 'react';
import { getAllConsumos } from '@/app/api/consumo/getAll';
import { Consumo as ConsumoType } from '@/lib/types/Consumo';
import { Skeleton } from '@/components/ui/skeleton';
import SimplePaginator from '@/components/SimplePaginator';
import Consumo from './components/Consumo';

const ITEMS_SIZE = 10;

export default function Consumptions() {
  const [consumos, setConsumos] = useState<ConsumoType[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, startFetch] = useTransition();

  useEffect(() => {
    startFetch(async () => {
      const { data } = await getAllConsumos({ page, size: ITEMS_SIZE });
      if (data) setConsumos(data);
    });
  }, [page]);

  return (
    <main className="flex flex-1 flex-col overflow-y-auto h-screen gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Consumos</h1>
          <p className="text-gray-500">
            Veja todos os produtos consumidos pelos clientes.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto gap-4">
        {isLoading ? (
          <Skeleton className="w-full h-28" />
        ) : (
          consumos.map((c, idx) => (
            <Consumo key={idx} {...c} />
          ))
        )}
      </div>

      <div className="flex items-center justify-center w-full">
        <SimplePaginator
          currentPage={page}
          setCurrentPage={setPage}
          disableNext={consumos.length < ITEMS_SIZE}
        />
      </div>
    </main>
  );
}
