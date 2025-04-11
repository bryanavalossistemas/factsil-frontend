import { update } from '@/api/products';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Category } from '@/schemas/categories';
import { Product, ProductForm, ProductFormSchema } from '@/schemas/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FormFields from '@/components/admin/dashboard/products/FormFields';
import { useSearchParams } from 'react-router';

interface UpdateFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: Product;
  categories: Category[];
}

export default function UpdateForm({ setOpen, item, categories }: UpdateFormProps) {
  const { id, name, category_id, cod_producto, image_path, unidad, mto_precio_unitario, stock, tip_afe_igv } = item;

  const form = useForm<ProductForm>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: name,
      mto_precio_unitario: mto_precio_unitario,
      category_id: category_id || 0,
      cod_producto: cod_producto || '',
      unidad: unidad || '',
      tip_afe_igv: tip_afe_igv || '',
      image: null,
      image_path: image_path,
    },
  });

  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: date === null ? ['products'] : ['products', date] });

      const previousItems = queryClient.getQueryData(date === null ? ['products'] : ['products', date]);

      const { name, category_id, cod_producto, unidad, mto_precio_unitario, image, image_path, tip_afe_igv } = formData;
      const updatedItem: Product & {
        isOptimistic?: boolean;
      } = {
        id: id,
        name: name,
        category_id: category_id,
        cod_producto: cod_producto,
        stock: stock,
        unidad: unidad,
        tip_afe_igv: tip_afe_igv,
        mto_precio_unitario: mto_precio_unitario,
        image_path: image_path ? image_path : image === null ? null : URL.createObjectURL(image),
        isOptimistic: true,
      };

      queryClient.setQueryData(date === null ? ['products'] : ['products', date], (oldItems: (Product & { isOptimistic?: boolean })[]) =>
        oldItems.map((item) => (item.id === id ? updatedItem : item)),
      );

      setOpen(false);
      toast.success('Producto actualizado correctamente');

      return { previousItems };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message);
      queryClient.setQueryData(date === null ? ['products'] : ['products', date], context?.previousItems);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(date === null ? ['products'] : ['products', date], (oldItems: (Product & { isOptimistic?: boolean })[]) => {
        return oldItems.map((item) => (item.isOptimistic ? newItem : item));
      });
    },
  });

  const onSubmit = (formData: ProductForm) => {
    mutate({ id, formData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-auto">
        <FormFields form={form} categories={categories} />
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
