import { identityDocuments } from '@/components/admin/dashboard/clients/constants';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientForm } from '@/schemas/clients';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<ClientForm>;
}

export default function FormFields({ form }: FormFieldsProps) {
  const tipo_doc = useWatch({ control: form.control, name: 'tipo_doc' });

  return (
    <div className="p-2 grid gap-6 overflow-auto">
      {/* NOMBRE */}
      <FormField
        control={form.control}
        name="rzn_social"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input
                placeholder={tipo_doc === '6' ? 'Representaciones Nataly S.A.C' : 'Alicia Loa y Pardo Menacho'}
                type="text"
                autoComplete="on"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* TIPO */}
      <FormField
        control={form.control}
        name="tipo_doc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RUC | DNI</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} name="tipo_doc">
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {identityDocuments.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* DOCUMENTO */}
      <FormField
        control={form.control}
        name="num_doc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de {tipo_doc === '6' ? 'RUC' : 'DNI'}</FormLabel>
            <FormControl>
              <Input placeholder={tipo_doc === '6' ? '20600007522' : '75013015'} type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
