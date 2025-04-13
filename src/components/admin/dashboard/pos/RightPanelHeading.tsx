import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import CreateButtonSuppliers from '@/components/admin/dashboard/clients/CreateButton';
import { SaleForm } from '@/schemas/sales';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client } from '@/schemas/clients';

interface RightPanelHeadingProps {
  clients: Client[];
}

export default function RightPanelHeading({ clients }: RightPanelHeadingProps) {
  const [openClientsPopover, setOpenClientsPopover] = useState(false);
  const { control, setValue } = useFormContext<SaleForm>();

  const tipo_doc = useWatch({ control: control, name: 'tipo_doc' });
  const filteredClients = useMemo(() => {
    if (tipo_doc === '01') {
      return clients.filter((c) => c.tipo_doc === '6');
    } else if (tipo_doc === '03') {
      return clients.filter((c) => c.tipo_doc === '1');
    }
    return clients;
  }, [clients, tipo_doc]);

  return (
    <div className="p-3 border-b">
      <div className="flex gap-2">
        {/* CUSTOMER ID */}
        <FormField
          control={control}
          name="client_id"
          render={({ field }) => (
            <div className="flex-1">
              <Popover open={openClientsPopover} onOpenChange={setOpenClientsPopover}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between w-full', !field.value && 'text-muted-foreground')}>
                      <span className="truncate max-w-[217px]">
                        {field.value ? filteredClients.find((customerId) => customerId.id === field.value)?.rzn_social : 'Seleccionar cliente'}
                      </span>
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[267px] p-0">
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
                              setValue('client_id', client.id);
                              setOpenClientsPopover(false);
                            }}
                          >
                            <span>{client.rzn_social}</span>
                            <CheckIcon className={cn('ml-auto', client.id === field.value ? 'opacity-100' : 'opacity-0')} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandGroup>
                      <CreateButtonSuppliers variant="ghost" className="w-full" />
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </div>
          )}
        />

        {/* DOCUMENT TYPE ID */}
        <FormField
          control={control}
          name="tipo_doc"
          render={({ field }) => (
            <FormItem>
              <Select
                name="tipo_doc"
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue('client_id', 0);
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
      </div>
    </div>
  );
}
