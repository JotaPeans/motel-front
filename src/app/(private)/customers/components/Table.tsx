import { Table as UITable, TableBody, TableHead, TableHeader, TableRow as UITableRow } from "@/components/ui/table"
import { TableRow } from "./TableRow"
import { Customer } from "@/lib/types/Customer"

interface TableProps {
  customers: Customer[]
}

export function Table({ customers }: TableProps) {
  return (
    <div className="rounded-md border bg-secondary/30">
      <UITable>
        <TableHeader>
          <UITableRow>
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Telefone</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">CPF</TableHead>
            <TableHead className="font-semibold">RG</TableHead>
          </UITableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} customer={customer} />
          ))}
        </TableBody>
      </UITable>
    </div>
  )
}
