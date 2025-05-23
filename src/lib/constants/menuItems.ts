import { BarChartBig, ShoppingBag, NotebookText, SquareUserRound, BedDouble, Plus } from "lucide-react"

export const menuItems = [
  {
    icon: BarChartBig,
    href: "/dashboard",
    label: "Dashboard",
    bold: false
  },
  {
    icon: ShoppingBag,
    href: "/consuption",
    label: "Consumo",
    bold: false
  },
  {
    icon: NotebookText,
    href: "/reservations",
    label: "Reservas",
    bold: false
  },
  {
    icon: SquareUserRound,
    href: "/customers",
    label: "Clientes",
    bold: false
  },
  {
    icon: BedDouble,
    href: "/rooms",
    label: "Quartos",
    bold: false
  },
  {
    icon: Plus,
    href: "/new-reservation",
    label: "Nova Reserva",
    bold: true
  },
]