"use client";

import { PixOrder } from "@/app/api/payment/createPixPaymentIntent";
import { getPaymentByProviderId } from "@/app/api/payment/getPaymentByProviderId";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { seconds, useTimer } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface PixDialogProps {
  order: PixOrder | null;
  clearOrder: () => void;
  customerPaid: (paymentId: number) => void;
}

var MAX_TIMEOUT = 60;

const PixDialog = ({ customerPaid, order, clearOrder }: PixDialogProps) => {
  const [open, setOpen] = useState(false);
  const timeRef = useRef<HTMLParagraphElement>(null);

  const imagemBase64 = `data:image/jpeg;base64,${order?.image_b64}`;

  useEffect(() => {
    if (order) setOpen(true);
  }, [order]);

  useEffect(() => {
    if (open && order !== null) {
      let timeout = MAX_TIMEOUT;

      useTimer(async (currentTime) => {
        if (timeRef.current) {
          timeRef.current.innerText = `Aguardando pagamento... (${currentTime})`;
        }

        const { data } = await getPaymentByProviderId(order.id);

        if (data) {
          await seconds(2);
          closeAll();
          customerPaid(data.id);
          return "break";
        }

        if (currentTime === 0) {
          closeAll();
          return "break";
        }
      }, timeout);
    }
  }, [open, order]);

  function closeAll() {
    setOpen(false);
    clearOrder();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pagamento QR Code PIX</DialogTitle>
        </DialogHeader>
        <Image
          src={imagemBase64}
          alt={order?.code || ""}
          width={500}
          height={500}
          className="mx-auto"
        />
        <p className="text-center" ref={timeRef}>
          Aguardando pagamento... ({MAX_TIMEOUT})
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PixDialog;
