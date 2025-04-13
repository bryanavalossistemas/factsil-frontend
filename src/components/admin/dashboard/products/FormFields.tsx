import { igvEffects, measurementUnits } from '@/components/admin/dashboard/products/constants';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Category } from '@/schemas/categories';
import { ProductForm } from '@/schemas/products';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface FormFieldsProps {
  form: UseFormReturn<ProductForm>;
  categories: Category[];
}

export default function FormFields({ form, categories }: FormFieldsProps) {
  const [openPopoverCategories, setOpenPopoverCategories] = useState(false);
  const [openDrawerCategories, setOpenDrawerCategories] = useState(false);

  const [openPopoverMeasurementUnits, setOpenPopoverMeasurementUnits] = useState(false);
  const [openDrawerMeasurementUnits, setOpenDrawerMeasurementUnits] = useState(false);

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
    <div className="p-2 grid gap-6 overflow-auto">
      {/* NOMBRE */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="Harina anita x 50kg" type="text" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SALE PRICE */}
      <FormField
        control={form.control}
        name="mto_precio_unitario"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio de venta</FormLabel>
            <FormControl>
              <Input placeholder="100.00" type="number" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <>
        {/* CATEGORY ID MOBILE */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:hidden">
              <FormLabel>Categoría</FormLabel>
              <Drawer open={openDrawerCategories} onOpenChange={setOpenDrawerCategories}>
                <DrawerTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? categories.find((category) => category.id === field.value)?.name : 'Seleccionar categoría'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Seleccionar Categoría</DrawerTitle>
                    <DrawerDescription>Busque la categoría del producto</DrawerDescription>
                  </DrawerHeader>
                  <Command>
                    <CommandInput placeholder="Buscar categoría..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ninguna categoría.</CommandEmpty>
                      <CommandItem
                        value={'Seleccionar categoría'}
                        onSelect={() => {
                          form.setValue('category_id', 0);
                          setOpenDrawerCategories(false);
                        }}
                      >
                        Seleccionar categoría
                        <CheckIcon className={cn('ml-auto', 0 === field.value ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            value={category.name}
                            key={category.id}
                            onSelect={() => {
                              form.setValue('category_id', category.id);
                              setOpenDrawerCategories(false);
                            }}
                          >
                            {category.name}
                            <CheckIcon className={cn('ml-auto', category.id === field.value ? 'opacity-100' : 'opacity-0')} />
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

        {/* CATEGORY ID DESKTOP */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem className="hidden sm:flex sm:flex-col">
              <FormLabel>Categoría</FormLabel>
              <Popover open={openPopoverCategories} onOpenChange={setOpenPopoverCategories}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? categories.find((category) => category.id === field.value)?.name : 'Seleccionar categoría'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[383px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar categoría..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ninguna categoría.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value={'Seleccionar categoría'}
                          onSelect={() => {
                            form.setValue('category_id', 0);
                            setOpenPopoverCategories(false);
                          }}
                        >
                          Seleccionar categoría
                          <CheckIcon className={cn('ml-auto', 0 === field.value ? 'opacity-100' : 'opacity-0')} />
                        </CommandItem>
                        {categories.map((category) => (
                          <CommandItem
                            value={category.name}
                            key={category.id}
                            onSelect={() => {
                              form.setValue('category_id', category.id);
                              setOpenPopoverCategories(false);
                            }}
                          >
                            {category.name}
                            <CheckIcon className={cn('ml-auto', category.id === field.value ? 'opacity-100' : 'opacity-0')} />
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
      </>

      {/* COD PROD */}
      <FormField
        control={form.control}
        name="cod_producto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código del producto</FormLabel>
            <FormControl>
              <Input placeholder="P001" type="text" autoComplete="on" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* UNIDAD */}
      <>
        {/* CATEGORY ID MOBILE */}
        <FormField
          control={form.control}
          name="unidad"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:hidden">
              <FormLabel>Categoría</FormLabel>
              <Drawer open={openDrawerMeasurementUnits} onOpenChange={setOpenDrawerMeasurementUnits}>
                <DrawerTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? measurementUnits.find((unit) => unit.value === field.value)?.label : 'Seleccionar unidad de medida'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Seleccionar Unidad de Medida</DrawerTitle>
                    <DrawerDescription>Busque la unidad de medida</DrawerDescription>
                  </DrawerHeader>
                  <Command>
                    <CommandInput placeholder="Buscar unidad de medida..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ninguna unidad de medida.</CommandEmpty>
                      <CommandGroup>
                        {measurementUnits.map((unit) => (
                          <CommandItem
                            value={unit.value}
                            key={unit.value}
                            onSelect={() => {
                              form.setValue('unidad', unit.value);
                              setOpenDrawerMeasurementUnits(false);
                            }}
                          >
                            {unit.label}
                            <CheckIcon className={cn('ml-auto', unit.value === field.value ? 'opacity-100' : 'opacity-0')} />
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

        {/* CATEGORY ID DESKTOP */}
        <FormField
          control={form.control}
          name="unidad"
          render={({ field }) => (
            <FormItem className="hidden sm:flex sm:flex-col">
              <FormLabel>Unidad de Medida</FormLabel>
              <Popover open={openPopoverMeasurementUnits} onOpenChange={setOpenPopoverMeasurementUnits}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? measurementUnits.find((unit) => unit.value === field.value)?.label : 'Seleccionar unidad de medida'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[383px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar unidad de medida..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ninguna unidad de medida.</CommandEmpty>
                      <CommandGroup>
                        {measurementUnits.map((unit) => (
                          <CommandItem
                            value={unit.value}
                            key={unit.value}
                            onSelect={() => {
                              form.setValue('unidad', unit.value);
                              setOpenPopoverMeasurementUnits(false);
                            }}
                          >
                            {unit.label}
                            <CheckIcon className={cn('ml-auto', unit.value === field.value ? 'opacity-100' : 'opacity-0')} />
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
      </>

      {/* Tipo de Afectación del IGV */}
      <FormField
        control={form.control}
        name="tip_afe_igv"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Afectación al IGV</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la Afectación al IGV" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {igvEffects.map((igvEffect) => (
                  <SelectItem key={igvEffect.value} value={igvEffect.value}>
                    {igvEffect.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* IMAGE */}
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
