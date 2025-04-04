import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cpfMask(value: string) {
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return value
}

export function rgMask(value: string) {
  if (value.length <= 7) {
    value = value.replace(/^(\d{1})(\d)/, "$1.$2");
    value = value.replace(/^(\d{1})\.(\d{3})(\d)/, "$1.$2.$3");
  }
  return value
}

export function phoneMask(value: string) {
  if (value.length <= 11) {
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
      value = value.replace(/($$\d{2}$$\s)(\d{5})(\d)/, "$1$2-$3");
    }
  }
  return value
}
