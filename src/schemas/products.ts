import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  mto_precio_unitario: z.coerce.number(),
  cod_producto: z.string().nullable(),
  tip_afe_igv: z.string(),
  category_id: z.number().nullable(),
  stock: z.number(),
  unidad: z.string(),
  image_path: z.string().nullable(),
});
export type Product = z.infer<typeof ProductSchema>;
export const ProductsSchema = z.array(ProductSchema);

export const ProductFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  mto_precio_unitario: z
    .number({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  cod_producto: z.string(),
  unidad: z.string(),
  tip_afe_igv: z.string(),
  category_id: z.number().int(),
  image: z.instanceof(File).nullable(),
  image_path: z.string().nullable(),
});
export type ProductForm = z.infer<typeof ProductFormSchema>;
