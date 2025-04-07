"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface InputFieldProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  classNames?: {
    rootClassName?: string;
    labelClassName?: string;
  };
}

const InputField = ({
  className,
  classNames,
  label,
  name,
  required,
  error,
  ...props
}: InputFieldProps) => {
  return (
    <div className={cn("flex flex-col gap-1", classNames?.rootClassName)}>
      <div className="flex items-center gap-1">
        <Label htmlFor={name} className={cn("text-md", classNames?.labelClassName)}>{label}</Label>
        {required && <span className="text-red-500">*</span>}
      </div>
      <Input id={name} name={name} {...props} className={cn("", className)} />
      {error && <p className="font-medium text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default InputField;
