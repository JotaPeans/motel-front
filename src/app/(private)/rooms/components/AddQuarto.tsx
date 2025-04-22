"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomTipo } from "@/lib/types/Room";
import { createRoom } from "@/app/api/room/create";
import { revalidateServerData } from "@/app/api/revalidateServerData";

const AddQuarto = () => {
  const pathname = usePathname();

  const [formData, setData] = useState<{ numero: string; valor: number, tipo: RoomTipo }>({
    numero: "",
    valor: 100.0,
    tipo: "SUITE",
  });
  const [error, setError] = useState("");
  const [isLoading, startFetch] = useTransition();

  function handleCreate() {
    if (formData.numero === "") {
      setError("Número do quarto é obrigatório!");
      return;
    }
    startFetch(async () => {
      setError("");

      const { data, error } = await createRoom({
        numero: parseInt(formData.numero),
        tipo: formData.tipo,
      });

      toast(
        data
          ? "Quarto criado com sucesso"
          : error?.message || "Erro ao criar o novo quarto!"
      );

      await revalidateServerData(pathname);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Quarto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Quarto</DialogTitle>
          <DialogDescription>
            Adicione informações sobre um novo quarto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="numero" className="text-right">
              Número
            </Label>
            <Input
              id="numero"
              placeholder="003"
              value={formData.numero}
              onChange={(e) => {
                setData((prev) => {
                  const newData = { ...prev };
                  newData.numero = e.target.value.replace(/\D/g, '');
                  return newData;
                });
              }}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valor" className="text-right">
              Preço
            </Label>

            <div className="col-span-3 relative">
              <span className="absolute left-2 -translate-y-1/2 top-1/2 dark:text-zinc-500 text-sm font-medium">R$</span>
              <Input
                id="valor"
                placeholder="003"
                value={formData.valor}
                onChange={(e) => {
                  setData((prev) => {
                    const newData = { ...prev };
                    const text = e.target.value.replace(/\D/g, '');
                    newData.valor = parseFloat(text) || 0;
                    return newData;
                  });
                }}
                className="col-span-3 pl-7"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipo" className="text-right">
              Tipo
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.tipo}
                onValueChange={(value) => {
                  setData((prev) => {
                    const newData = { ...prev };
                    newData.tipo = value as RoomTipo;
                    return newData;
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo</SelectLabel>
                    <SelectItem value="SUITE">Suite</SelectItem>
                    <SelectItem value="DELUXE">Deluxe</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {error && <span className="text-sm text-red-600">{error}</span>}
        <DialogFooter>
          <Button isLoading={isLoading} onClick={handleCreate}>
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuarto;
