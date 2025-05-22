"use client";

import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect, useTransition } from "react";

import { getAllCustomers } from "@/app/api/customer/getAll";
import SimplePaginator from "@/components/SimplePaginator";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer } from "@/lib/types/Customer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Table } from "./components/Table";
import AddCustomer from "./components/AddCustomer";

const ITEMS_SIZE = 30;

const Customers = () => {
  const [page, setPage] = useState(1);
  const [nome, setNome] = useState<string>();
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [isCustomersFetchLoading, startFetchCustomers] = useTransition();

  useEffect(() => {
    fetchCustomers();
  }, [page, nome]);

  function fetchCustomers() {
    startFetchCustomers(async () => {
      const { data } = await getAllCustomers({
        nome,
        page,
        size: ITEMS_SIZE,
      });

      if (data) setCustomers(data);
    });
  }

  const debounced = useDebouncedCallback((value) => {
    setNome(value);
  }, 1000);

  return (
    <main className="flex flex-1 flex-col overflow-y-auto h-screen gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-gray-500">Veja todos is clientes cadastrados.</p>
        </div>

        <AddCustomer refetch={fetchCustomers} />
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="filter">Filtrar</Label>
          <Input
            id="filter"
            placeholder="Filtrar clientes por nome"
            onChange={(e) => debounced(e.target.value)}
          />
        </div>
        {isCustomersFetchLoading ? (
          <Skeleton className="w-full h-20" />
        ) : (
          <Table customers={customers} />
        )}
      </div>
      <div className="flex items-center justify-center w-full">
        <SimplePaginator
          currentPage={page}
          setCurrentPage={setPage}
          disableNext={customers.length < ITEMS_SIZE}
        />
      </div>
    </main>
  );
};

export default Customers;
