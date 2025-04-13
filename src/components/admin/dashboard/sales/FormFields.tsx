import { Button } from '@/components/ui/button';
import { SaleForm } from '@/schemas/sales';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatCurrency } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon, TrashIcon } from 'lucide-react';
import CreateButton from '@/components/admin/dashboard/sales/details/CreateButton';
import { TableCell, TableHeader, TableRow, Table, TableCaption, TableBody, TableFooter, TableHead } from '@/components/ui/table';
import UpdateButton from '@/components/admin/dashboard/sales/details/UpdateButton';
import { Client } from '@/schemas/clients';
import { useMemo, useState } from 'react';

interface FormFieldsProps {
  form: UseFormReturn<SaleForm>;
  clients: Client[];
}

export default function FormFields({ form, clients }: FormFieldsProps) {
  const [openCustomersDrawer, setOpenCustomersDrawer] = useState(false);
  const [openCustomersPopover, setOpenCustomersPopover] = useState(false);
  const currentDocumentType = useWatch({ control: form.control, name: 'tipo_doc' });

  const filteredClients = useMemo(() => {
    if (currentDocumentType === '01') {
      return clients.filter((c) => c.tipo_doc === '6');
    } else if (currentDocumentType === '03') {
      return clients.filter((c) => c.tipo_doc === '1');
    }
    return clients;
  }, [clients, currentDocumentType]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 sm:flex sm:justify-between sm:gap-4">
        <div className="grid gap-6 sm:flex sm:gap-2 flex-1">
          {/* DOCUMENT TYPE */}
          <FormField
            control={form.control}
            name="tipo_doc"
            render={({ field }) => (
              <FormItem>
                <Select
                  name="tipo_doc"
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('client_id', 0);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-auto w-[100px]">
                    <SelectItem value={'01'}>Factura</SelectItem>
                    <SelectItem value={'03'}>Boleta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SUPPLIER ID */}
          <div className="flex-1">
            {/* MOBILE */}
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:hidden">
                  <FormLabel>Cliente</FormLabel>
                  <Drawer open={openCustomersDrawer} onOpenChange={setOpenCustomersDrawer}>
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value ? filteredClients.find((client) => client.id === field.value)?.rzn_social : 'Seleccionar cliente'}
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Seleccionar Cliente</DrawerTitle>
                        <DrawerDescription>Busque el cliente de la venta</DrawerDescription>
                      </DrawerHeader>
                      <Command>
                        <CommandInput placeholder="Buscar cliente..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No se encontró ningún cliente</CommandEmpty>
                          <CommandGroup>
                            {filteredClients.map((client) => (
                              <CommandItem
                                value={client.rzn_social}
                                key={client.id}
                                onSelect={() => {
                                  form.setValue('client_id', client.id);
                                  setOpenCustomersDrawer(false);
                                }}
                              >
                                {client.rzn_social}
                                <CheckIcon className={cn('ml-auto', client.id === field.value ? 'opacity-100' : 'opacity-0')} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DrawerContent>
                  </Drawer>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* DESKTOP */}
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem className="hidden sm:flex sm:flex-col">
                  <Popover open={openCustomersPopover} onOpenChange={setOpenCustomersPopover}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                          <span className="truncate max-w-[465px]">
                            {field.value ? filteredClients.find((client) => client.id === field.value)?.rzn_social : 'Seleccionar cliente'}
                          </span>
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[517.39px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar cliente..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No se encontró ningún cliente</CommandEmpty>
                          <CommandGroup>
                            {filteredClients.map((client) => (
                              <CommandItem
                                value={client.rzn_social}
                                key={client.id}
                                onSelect={() => {
                                  form.setValue('client_id', client.id);
                                  setOpenCustomersPopover(false);
                                }}
                              >
                                {client.rzn_social}
                                <CheckIcon className={cn('ml-auto', client.id === field.value ? 'opacity-100' : 'opacity-0')} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <CreateButton purchaseForm={form} />
      </div>
      <div className="flex-1 mt-4">
        <FormField
          control={form.control}
          name="sale_details"
          render={({ field }) => (
            <FormItem>
              <Table>
                <TableCaption>Detalles de la venta</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead />
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {field.value
                    .filter((d) => d.deleted === undefined)
                    .map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell>
                          <div className="flex gap-x-2">
                            <TrashIcon
                              className="text-red-600 w-5 h-5"
                              onClick={() => {
                                if (detail.created) {
                                  form.setValue(
                                    'sale_details',
                                    field.value.filter((p) => p.id !== detail.id),
                                  );
                                } else {
                                  form.setValue(
                                    'sale_details',
                                    field.value.map((p) => (p.id === detail.id ? { ...p, deleted: true } : p)),
                                  );
                                }
                              }}
                            />
                            <UpdateButton purchaseForm={form} item={detail} />
                          </div>
                        </TableCell>
                        <TableCell className="truncate max-w-[460px]">{detail.descripcion}</TableCell>
                        <TableCell className="text-center">{detail.cantidad}</TableCell>
                        <TableCell className="text-right">{formatCurrency(detail.mto_precio_unitario)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(detail.mto_precio_unitario * detail.cantidad)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(field.value.reduce((acummulator, detail) => acummulator + detail.mto_precio_unitario * detail.cantidad, 0))}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
