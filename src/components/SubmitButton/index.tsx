"use client";

import { useFormStatus } from "react-dom";
import { ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

import Loading from "../ui/loading";

interface SubmitButtonProps extends ButtonProps {
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  loadingClassName?: string;
  text?: string;
  onPending?: (pending: boolean) => void;
  onPendingEnd?: () => void;
}

const SubmitButton = ({
  disabled,
  icon,
  className,
  loadingClassName,
  text,
  children,
  onPending,
  onPendingEnd,
  ...rest
}: SubmitButtonProps) => {
  const [clicked, setClicked] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if(onPending) {
      onPending(pending);
    }
  }, [pending, onPending]);

  useEffect(() => {
    if(onPendingEnd) {
      setTimeout(() => {
        if(clicked && pending === false) {
          onPendingEnd();
          setClicked(false);
        }
      }, 100);
    }
  }, [pending, clicked, onPendingEnd]);

  return (
    <Button
      {...rest}
      disabled={pending || Boolean(disabled)}
      size={icon ? "icon" : "default"}
      className={cn(className)}
      onClick={() => setClicked(true)}
      type="submit"
    >
      {pending ? <Loading className={cn(loadingClassName)} /> : icon ? icon : text || children ? text || children : "Salvar"}
    </Button>
  );
};

export default SubmitButton;
