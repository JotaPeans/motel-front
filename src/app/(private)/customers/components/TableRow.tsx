import { TableCell, TableRow as UITableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Customer } from "@/lib/types/Customer"

interface TableRowProps {
  customer: Customer
}

export function TableRow({ customer }: TableRowProps) {
  return (
    <UITableRow>
      <TableCell className="py-4">{customer.id}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>
              {customer.nome
                .split(" ")
                .map((name) => name[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{customer.nome}</span>
        </div>
      </TableCell>
      <TableCell>{customer.telefone}</TableCell>
      <TableCell>{customer.email}</TableCell>
      <TableCell>{customer.cpf}</TableCell>
      <TableCell>{customer.rg}</TableCell>
    </UITableRow>
  )
}
