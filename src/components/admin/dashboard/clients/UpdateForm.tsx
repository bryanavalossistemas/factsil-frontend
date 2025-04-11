import { update } from '@/api/clients';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Client, ClientForm, ClientFormSchema } from '@/schemas/clients';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormFields from '@/components/admin/dashboard/clients/FormFields';
import { useSearchParams } from 'react-router';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Client;
}

export default function UpdateForm({ setOpen, item }: UpdateFormProps) {
  const { id, rzn_social, tipo_doc, num_doc } = item;

  const form = useForm<ClientForm>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      rzn_social: rzn_social,
      tipo_doc: tipo_doc,
      num_doc: num_doc,
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['clients'] : ['clients', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['clients'] : ['clients', date]);

      const { rzn_social, tipo_doc, num_doc } = formData;

      const updatedItem: Client & {
        isOptimistic?: boolean;
      } = {
        id: id,
        rzn_social: rzn_social,
        tipo_doc: tipo_doc,
        num_doc: num_doc,
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['clients'] : ['clients', date], (oldItems: (Client & { isOptimistic?: boolean })[]) =>
        oldItems.map((item) => (item.id === id ? updatedItem : item)),
      );

      setOpen(false);
      toast.success('Cliente actualizado correctamente');

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['clients'] : ['clients', date], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(date === null ? ['clients'] : ['clients', date], (oldItems: (Client & { isOptimistic?: boolean })[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: ClientForm) => {
    mutate({ id, formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-auto">
        <FormFields form={form} />
        <div className="p-2 flex flex-col sm:flex-row-reverse gap-2 mt-2 sm:mt-4">
          <Button type="submit" disabled={isPending}>
            Guardar
          </Button>
          <Button onClick={() => setOpen(false)} type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
