"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Room } from "@/lib/types/Room";
import { getAllRooms } from "@/app/api/room/getAll";
import { Customer } from "@/lib/types/Customer";
import { cn, cpfMask, phoneMask, rgMask } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllCustomers } from "@/app/api/customer/getAll";
import { createReservation } from "@/app/api/reservation/create";

const formSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().min(2, {
    message: "Nome do hóspede deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido.",
  }),
  phone: z.string().min(10, {
    message: "Por favor, insira um número de telefone válido.",
  }),
  cpf: z.string().min(11, {
    message: "Por favor, insira um cpf válido.",
  }),
  rg: z.string().min(7, {
    message: "Por favor, insira um rg válido.",
  }),
  quartoId: z.string({
    required_error: "Por favor, selecione um quarto.",
  }),
  paymentMethod: z.string({
    required_error: "Por favor, selecione um método de pagamento.",
  }),
});

export function ReservationForm() {
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);

  const [isLoading, startFetch] = useTransition();
  const [_, startFetchRooms] = useTransition();
  const [isSearchLoading, startFetchCustomer] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      cpf: "",
      rg: "",
    },
  });

  const isSelectedCustomer = form.getValues("customerId");

  const handleGuestSearch = (value: string) => {
    startFetchCustomer(async () => {
      if (value.length < 2) {
        setSearchResults([]);
        return;
      }

      const { data } = await getAllCustomers(value);

      if (data) {
        setSearchResults(data);
        setSearchOpen(data.length > 0);
      }
    });
  };

  useEffect(() => {
    const customerName = form.watch("customerName");
    if (customerName === "") {
      form.reset();
    }

    const timeoutId = setTimeout(() => {
      if (customerName) handleGuestSearch(customerName);
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [form.watch("customerName")]);

  const selectUser = (user: Customer) => {
    form.setValue("customerId", user.id.toString());
    form.setValue("customerName", user.nome);
    form.setValue("email", user.email);
    form.setValue("phone", phoneMask(user.telefone));
    form.setValue("cpf", cpfMask(user.cpf));
    form.setValue("rg", rgMask(user.rg));
    setSearchOpen(false);
  };

  useEffect(() => {
    startFetchRooms(async () => {
      const { data } = await getAllRooms();

      if (data) setRooms(data);
    });
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    startFetch(async () => {
      const { data, error } = await createReservation({
        cliente: {
          id: parseInt(values.customerId || "0"),
          cpf: values.cpf,
          rg: values.rg,
          email: values.email,
          nome: values.customerName,
          telefone: values.phone,
        },
        funcionarioId: 1,
        quartoId: parseInt(values.quartoId || "0"),
      });

      // TODO: Chamar back para fazer o pagamento? 

      toast(data ? "Reserva criada com sucesso!" : error?.message);
    });
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    form.setValue("cpf", cpfMask(value));
  };

  const handleRgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    form.setValue("rg", rgMask(value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    form.setValue("phone", phoneMask(value));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nome do Hóspede</FormLabel>
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Digite para buscar hóspedes"
                          {...field}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full"
                        />
                        <button
                          className="absolute right-0 top-0 h-full px-3 cursor-pointer"
                          onClick={() => setSearchOpen(!searchOpen)}
                          type="button"
                        >
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </button>
                      </div>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="col-span-1 p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandEmpty>
                          {isSearchLoading
                            ? "Buscando..."
                            : "Nenhum hóspede encontrado."}
                        </CommandEmpty>
                        <CommandGroup>
                          {searchResults.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.id.toString()}
                              onSelect={() => selectUser(user)}
                            >
                              <div className="flex flex-col">
                                <span>{user.nome}</span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  form.getValues("customerId") ===
                                    user.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={Boolean(isSelectedCustomer)}
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            disabled={Boolean(isSelectedCustomer)}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(00) 00000-0000"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handlePhoneChange(e);
                    }}
                    maxLength={14}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            disabled={Boolean(isSelectedCustomer)}
            render={({ field }) => (
              <FormItem>
                <FormLabel>cpf</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleCpfChange(e);
                    }}
                    maxLength={14}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rg"
            disabled={Boolean(isSelectedCustomer)}
            render={({ field }) => (
              <FormItem>
                <FormLabel>rg</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0.000.000"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleRgChange(e);
                    }}
                    maxLength={9}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quartoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quarto</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um quarto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms.map((room, key) => (
                      <SelectItem key={key} value={room.id.toString()}>
                        {room.numero}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pagamento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="creditCard">
                      Cartão de Crédito
                    </SelectItem>
                    <SelectItem value="debitCard">Cartão de Débito</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="bankTransfer">
                      Transferência Bancária
                    </SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Criar Reserva
          </Button>
        </div>
      </form>
    </Form>
  );
}
