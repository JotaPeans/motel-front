import type { Metadata } from "next"
import Link from "next/link"
import { BedDouble } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReservationForm } from "./components/ReservationForm"

export const metadata: Metadata = {
  title: "Nova Reserva",
  description: "Crie uma nova reserva",
}

const NewReservationPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BedDouble className="h-6 w-6" />
          <span>Motel Manager</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/rooms">Rooms</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/reservations">Reservations</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/customers">Guests</Link>
          </Button>
        </nav>
      </header>
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
    </div>
  );
}
 
export default NewReservationPage;