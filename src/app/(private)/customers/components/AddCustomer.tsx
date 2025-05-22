"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cpfMask, phoneMask, rgMask } from "@/lib/utils";
import { toast } from "sonner";
import { addCustomer } from "@/app/api/customer/addCustomer";

const formSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome do hóspede deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido.",
  }),
  telefone: z.string().min(10, {
    message: "Por favor, insira um número de telefone válido.",
  }),
  cpf: z.string().min(11, {
    message: "Por favor, insira um cpf válido.",
  }),
  rg: z.string().min(7, {
    message: "Por favor, insira um rg válido.",
  }),
});

type formType = z.infer<typeof formSchema>;

interface AddCustomerProps {
  refetch: () => void;
}

const AddCustomer = ({ refetch }: AddCustomerProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, startCreate] = useTransition();

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      rg: "",
    },
  });

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
    form.setValue("telefone", phoneMask(value));
  };

  function onSubmit(values: formType) {
    startCreate(async () => {
      const { data } = await addCustomer({ id: 0, ...values });

      if (data) {
        setOpen(false);
        refetch();
        toast("Cliente adicionado com sucesso", {
          duration: 3000,
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Adicionar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="email do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="telefone do cliente"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cpf do cliente"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RG</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="rg do cliente"
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
            <DialogFooter>
              <Button type="submit" isLoading={isLoading}>
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomer;
