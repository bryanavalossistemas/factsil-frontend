import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { Sale } from '@/schemas/sales';
import { Checkbox } from '@/components/ui/checkbox';
import RemoveButton from '@/components/admin/dashboard/sales/RemoveButton';
// import UpdateButton from '@/components/admin/dashboard/sales/UpdateButton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const columnHelper = createColumnHelper<Sale>();

export const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableHiding: false,
  }),

  columnHelper.accessor('serie', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Serie</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('correlativo', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>N° Documento</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('created_at', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Fecha</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => formatDate(new Date(info.getValue())),
  }),

  columnHelper.accessor('client.rzn_social', {
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Cliente</span>
        <ArrowUpDownIcon className="size-4" />
      </div>
    ),
    cell: (info) => <div className="whitespace-normal">{info.getValue()}</div>,
  }),

  columnHelper.accessor('estado_sunat', {
    header: ({ column }) => (
      <div className="flex justify-center">
        <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Estado</span>
          <ArrowUpDownIcon className="size-4" />
        </div>
      </div>
    ),
    cell: (info) => (
      <div className="flex justify-center">
        <Badge
          className="capitalize"
          variant={info.getValue() === 'aceptado' ? 'default' : info.getValue() === 'pendiente' ? 'secondary' : 'destructive'}
        >
          {info.getValue()}
        </Badge>
      </div>
    ),
  }),

  columnHelper.accessor('mto_imp_venta', {
    header: ({ column }) => (
      <div className="flex justify-end">
        <div className="flex items-center gap-1 cursor-pointer w-fit" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Total</span>
          <ArrowUpDownIcon className="size-4" />
        </div>
      </div>
    ),
    cell: (info) => <div className="flex justify-end">{formatCurrency(info.getValue())}</div>,
  }),

  columnHelper.display({
    id: 'action',
    cell: ({ row }) => (
      <div className="flex gap-2 justify-end">
        {/* <UpdateButton item={row.original} /> */}
        <RemoveButton id={row.original.id} />
      </div>
    ),
    enableHiding: false,
  }),
];
