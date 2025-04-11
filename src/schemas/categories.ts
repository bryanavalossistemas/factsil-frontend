import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  image_path: z.string().nullable(),
});
export type Category = z.infer<typeof CategorySchema>;
export const CategoriesSchema = z.array(CategorySchema);

export const CategoryFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  image: z.instanceof(File).nullable(),
  image_path: z.string().nullable(),
});
export type CategoryForm = z.infer<typeof CategoryFormSchema>;
