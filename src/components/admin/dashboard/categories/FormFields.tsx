import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CategoryForm } from '@/schemas/categories';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<CategoryForm>;
}

export default function FormFields({ form }: FormFieldsProps) {
  const image = useWatch({ control: form.control, name: 'image' });
  const image_path = useWatch({ control: form.control, name: 'image_path' });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (files.length) {
        for (const file of files) {
          form.setValue('image', file);
        }
        if (image_path) {
          form.setValue('image_path', null);
        }
      } else {
        form.setValue('image', null);
      }
    }
  };

  return (
    <div className="grid gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="Harinas" type="text" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name="image_path"
          render={() => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" multiple={false} placeholder="imagenes" onChange={handleImageChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {image_path && (
          <>
            <div className="flex justify-center">
              <div className="grid">
                <img
                  src={`${import.meta.env.VITE_API_URL}/storage/${image_path}`}
                  alt={`${image_path}`}
                  className="w-28 h-28 object-cover rounded-t-sm"
                />
                <Button type="button" onClick={() => form.setValue('image_path', null)} className="rounded-t-none">
                  Eliminar
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {image && (
          <div className="flex justify-center">
            <img src={URL.createObjectURL(image)} alt={`${image.name}`} className="w-28 h-28 object-cover rounded-t-sm" />
          </div>
        )}
      </div>
    </div>
  );
}
