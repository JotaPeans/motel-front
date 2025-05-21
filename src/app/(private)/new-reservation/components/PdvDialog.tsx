import {
  Wifi,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPdvPaymentIntentStatusById } from "@/app/api/payment/getPdvPaymentIntentStatusById";
import { PointOrder } from "@/app/api/payment/createPointPaymentIntent";
import { getPaymentByProviderId } from "@/app/api/payment/getPaymentByProviderId";
import { cancelPointPaymentIntent } from "@/app/api/payment/cancelPointPaymentIntent";
import { seconds, useTimer } from "@/lib/utils";

interface ScreenPdvProps {
  order?: PointOrder | null;
  clearOrder: () => void;
  customerPaid: (paymentId: number) => void;
}

var MAX_TIMEOUT = 80;

const Pdv = ({ order, clearOrder, customerPaid }: ScreenPdvProps) => {
  const [open, setOpen] = useState(false);
  const [pdvStatus, setPdvStatus] = useState<"OPEN" | "FINISHED" | "CANCELED">(
    "OPEN"
  );
  const timeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (order) setOpen(true);
  }, [order]);

  useEffect(() => {
    if (open && order) {
      let timeout = MAX_TIMEOUT;

      useTimer(async (currentTime) => {
        if (timeRef.current) {
          timeRef.current.innerText = `Aguardando pagamento... (${currentTime})`;
        }

        const { data } = await getPaymentByProviderId(order.id);

        if (data) {
          setPdvStatus("FINISHED");
          await seconds(2);
          closeAll();
          customerPaid(data.id);
          return "break";
        }

        if (currentTime === 0) {
          closeAll();
          await cancelPointPaymentIntent({ paymentIntentId: order.id });
          return "break";
        }
      }, timeout);
    }
  }, [order, open]);

  function closeAll() {
    setOpen(false);
    clearOrder();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[600px] flex flex-col"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Pagamento PDV</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center pt-5 px-10">
          <div className="w-64 scale-125 bg-sky-400 rounded-3xl border-8 border-sky-500 flex flex-col gap-3 shadow-xl p-3 mt-5">
            <div className="relative w-full h-40 bg-slate-700 rounded-lg mt-8 p-4 pt-6 border-4 border-slate-800">
              <Wifi
                size={18}
                className="absolute right-3 top-1 rotate-90 text-white"
              />
              {pdvStatus === "OPEN" ? (
                <div className="relative w-full h-full bg-slate-200 rounded-lg flex flex-col justify-end text-center font-semibold p-2">
                  <div className="flex items-start justify-center text-zinc-800">
                    <span className="text-lg">R$</span>
                    <span className="text-4xl">
                      {order && (order.amount / 100).toFixed(2)}
                    </span>
                  </div>
                  <h3 className="mt-5 bg-green-700/80 text-white px-2 py-0.5 text-xs flex justify-center gap-2 items-center rounded-md">
                    Selecionado: {order?.method}
                  </h3>
                </div>
              ) : (
                <div className="w-full h-full bg-green-500 rounded-lg flex justify-center items-center">
                  <CheckCircle2 className="text-white" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 w-full text-xs text-center text-white gap-1 font-medium">
              <span className="max-h-7 bg-slate-800 rounded-md py-1 text-[0.6rem]">
                ul.pgtos
              </span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1 text-[0.6rem]">
                ajuda
              </span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1 text-[0.6rem]">
                av.papel
              </span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1">menu</span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">1</span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">2</span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">3</span>
              <span className="max-h-7 bg-red-500 rounded-md py-1.5 flex justify-center items-center animate-pulse">
                <X className="text-lg" />
              </span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">4</span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">5</span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">6</span>
              <span className="max-h-7 bg-yellow-400 rounded-md py-1.5 flex justify-center items-center">
                <ChevronLeft className="text-lg" />
              </span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">7</span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">8</span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">9</span>
              <span className="bg-green-600 rounded-md py-1.5 row-span-2 h-full flex justify-center items-center animate-pulse">
                <CheckCircle2 className="text-2xl" />
              </span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5 flex justify-center items-center">
                <ChevronUp size={18} className="text-lg" />
              </span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5">0</span>
              <span className="max-h-7 bg-slate-800 rounded-md py-1.5 flex justify-center items-center">
                <ChevronDown size={18} className="text-lg" />
              </span>
            </div>
          </div>

          <div className="mt-20 w-full text-zinc-600 font-semibold space-y-3 text-xl">
            <h1 className="text-3xl text-zinc-700">Na maquineta pressione:</h1>

            <h1 className="flex gap-2 items-center">
              <span className="flex justify-center items-center bg-green-600 text-white py-4 px-4 rounded-lg">
                <CheckCircle2 className="text-white" />
              </span>
              para iniciar o pagamento
            </h1>

            <h1 className="flex gap-2 items-center">
              <span className="bg-red-500 rounded-md py-2 flex justify-center items-center text-white p-4">
                <X className="text-lg" />
              </span>
              para cancelar o pagamento
            </h1>
          </div>

          <p
            ref={timeRef}
            className="font-medium text-lg text-zinc-500 mt-8 mx-auto"
          >
            Aguardando pagamento... (80)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Pdv;
