import { Clock, MapPin, User } from "lucide-react";
import { format, differenceInHours } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoomTipo } from "@/lib/types/Room";
import { PaymentMethodType } from "@/lib/types/Payment";

const days = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

interface ReservationProps {
  checkIn: string;
  checkOut?: string;
  customer: string;
  room: string;
  roomType: RoomTipo;
  roomPrice: number;
  paymentType: PaymentMethodType;
}

const Reservation = ({
  checkIn,
  checkOut,
  customer,
  room,
  roomType,
  roomPrice,
  paymentType,
}: ReservationProps) => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-center pr-3">
            <div className="text-sm font-medium text-primary">
              {days[new Date(checkIn).getDay()]}
            </div>
            <div className="text-3xl font-bold">
              {new Date(checkIn).getDate()}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm text-zinc-300">
                    {format(new Date(checkIn), "kk:mm")} -{" "}
                    {checkOut
                      ? format(new Date(checkOut), "kk:mm")
                      : "Em andamento"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{customer}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-300" />
                  <span className="text-sm">
                    Suíte <span className="capitalize">{roomType === "DELUXE" ? "deluxe" : "padrão"}</span> <span className="font-semibold">#{room}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-sm font-semibold">
                    {Intl.NumberFormat("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    }).format(roomPrice)}
                  </span>
                  <Badge className="bg-green-100 text-green-700 font-mono font-bold uppercase">
                    {paymentType}
                  </Badge>
                </div>
              </div>

              <Badge className="bg-emerald-100 text-emerald-700 font-semibold">
                {checkOut
                  ? `${differenceInHours(
                      new Date(checkOut),
                      new Date(checkIn)
                    )}h`
                  : "Em andamento"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reservation;
