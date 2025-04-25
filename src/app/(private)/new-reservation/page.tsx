import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReservationForm } from "./components/ReservationForm";

export const metadata: Metadata = {
  title: "MotelHub | Nova Reserva",
  description: "Crie uma nova reserva",
};

const NewReservationPage = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nova Reserva</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Reserva</CardTitle>
          <CardDescription>Crie uma reserva para um cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <ReservationForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default NewReservationPage;
