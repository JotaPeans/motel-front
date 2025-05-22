"use client";

import { useEffect, useState, useTransition } from "react";

import { getAllReservations } from "@/app/api/reservation/getAll";
import { Reservation as ReservationType } from "@/lib/types/Reservation";
import { Skeleton } from "@/components/ui/skeleton";
import SimplePaginator from "@/components/SimplePaginator";

import Reservation from "./components/Reservation";

const ITEMS_SIZE = 10;

const Reservations = () => {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [page, setPage] = useState(1);

  const [isLoading, startFetch] = useTransition();

  useEffect(() => {
    startFetch(async () => {
      const { data } = await getAllReservations({
        page: page,
        size: ITEMS_SIZE,
      });

      if (data) setReservations(data);
    });
  }, [page]);

  return (
    <main className="flex flex-1 flex-col overflow-y-auto h-screen gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Reservas</h1>
          <p className="text-gray-500">
            Veja todas as reservas agendadas para suas suítes.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto gap-4">
        {isLoading ? (
          <Skeleton className="w-full h-28" />
        ) : (
          reservations.map((reservation, key) => (
            <Reservation
              key={key}
              checkIn={reservation.data_checkin}
              checkOut={reservation.data_checkout}
              customer={reservation.cliente_nome}
              room={reservation.quarto_numero}
              roomPrice={reservation.quarto_preco}
              roomType={reservation.quarto_tipo}
              paymentType={reservation.forma_pagamento}
            />
          ))
        )}
      </div>
      <div className="flex items-center justify-center w-full">
        <SimplePaginator
          currentPage={page}
          setCurrentPage={setPage}
          disableNext={reservations.length < ITEMS_SIZE}
        />
      </div>
    </main>
  );
};

export default Reservations;
