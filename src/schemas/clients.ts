import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.number(),
  tipo_doc: z.enum(['1', '6']),
  num_doc: z.string(),
  rzn_social: z.string(),
});
export type Client = z.infer<typeof ClientSchema>;
export const ClientsSchema = z.array(ClientSchema);

export const ClientFormSchema = z
  .object({
    tipo_doc: z.string(),
    num_doc: z.string(),
    rzn_social: z.string().min(1, { message: 'La razon social es obligatoria' }),
  })
  .superRefine((value, ctx) => {
    const { tipo_doc, num_doc } = value;

    if (tipo_doc === '6' && num_doc.length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El RUC debe tener 11 dígitos',
        path: ['num_doc'],
      });
    }

    if (tipo_doc === '1' && num_doc.length !== 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El DNI debe tener 8 dígitos',
        path: ['num_doc'],
      });
    }
  });
export type ClientForm = z.infer<typeof ClientFormSchema>;
