import { ChevronDown, Search, SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { columns, dateOptions } from '@/components/admin/dashboard/send-sunat/constants';
import { Table } from '@tanstack/react-table';
import { useSearchParams } from 'react-router';
import { Sale, SaleSchema } from '@/schemas/sales';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendSunat } from '@/api/sendSunat';

interface TableHeadingProps<T> {
  table: Table<T>;
}

export default function TableHeading<T>({ table }: TableHeadingProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const onChangeDate = (date: string | null) => {
    if (date === null) {
      searchParams.delete('date');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ date: date });
    }
  };

  const { mutateAsync } = useMutation({
    mutationFn: sendSunat,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['sendSunat'] : ['sendSunat', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['sendSunat'] : ['sendSunat', date]);

      queryClient.setQueryData(date === null ? ['sendSunat'] : ['sendSunat', date], (oldItems: (Sale & { isOptimistic?: boolean })[]) =>
        oldItems.filter((item) => item.id !== id),
      );

      table.resetRowSelection();

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['sendSunat'] : ['sendSunat', date], context?.previousItems);
    },
  });

  return (
    <div className="flex flex-col sm:flex-row-reverse gap-2">
      <div className="flex gap-2">
        {/* SEND BUTTON */}
        {table.getSelectedRowModel().rows.length > 0 ? (
          <Button
            className="flex-1 h-9 sm:w-auto sm:h-9"
            onClick={async () => {
              const salesToSend = table.getSelectedRowModel().rows.map((row) => SaleSchema.parse(row.original).id);

              let successCount = 0;
              let errorCount = 0;

              await Promise.all(
                salesToSend.map(async (id) => {
                  try {
                    await mutateAsync({ id });
                    successCount++;
                  } catch (error) {
                    errorCount++;
                    console.error(error);
                  }
                }),
              );

              if (successCount > 0) {
                toast.success(`${successCount} comprobante(s) enviado(s) correctamente`);
              }

              if (errorCount > 0) {
                toast.error(`${errorCount} error(es) al enviar comprobante(s)`);
              }
            }}
          >
            <span className="hidden sm:block">Enviar Seleccionados</span>
            <SendIcon strokeWidth={2.5} />
          </Button>
        ) : (
          <Button
            className="flex-1 h-9 sm:w-auto sm:h-9"
            onClick={async () => {
              const salesToSend = table.getRowModel().rows.map((row) => SaleSchema.parse(row.original).id);

              let successCount = 0;
              let errorCount = 0;

              await Promise.all(
                salesToSend.map(async (id) => {
                  try {
                    await mutateAsync({ id });
                    successCount++;
                  } catch (error) {
                    errorCount++;
                    console.error(error);
                  }
                }),
              );

              if (successCount > 0) {
                toast.success(`${successCount} comprobante(s) enviado(s) correctamente`);
              }

              if (errorCount > 0) {
                toast.error(`${errorCount} error(es) al enviar comprobante(s)`);
              }
            }}
          >
            <span className="hidden sm:block">Enviar Todo</span>
            <SendIcon strokeWidth={2.5} />
          </Button>
        )}

        {/* DATERANGE OPTION */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <span>{dateOptions.find((p) => p.value === date)?.label}</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {dateOptions.map((p) => (
              <DropdownMenuCheckboxItem key={p.id} checked={p.value === date} onCheckedChange={() => onChangeDate(p.value)}>
                {p.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* DISPLAY COLUMNS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <span>Columnas</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columns[column.id]}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* SEARCH */}
      <div className="flex-1 flex gap-2 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="search"
            placeholder="Buscar comprobante"
            value={table.getState().globalFilter ?? ''}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Checkbox
          className="size-9 rounded-md sm:hidden"
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    </div>
  );
}
