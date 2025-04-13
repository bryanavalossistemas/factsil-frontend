import { z } from 'zod';

export const SendSunatSchema = z.object({
  id: z.number(),
  tipo_doc: z.string(),
  tipo_operacion: z.string(),
  serie: z.string(),
  correlativo: z.number(),
  tipo_moneda: z.string(),
  valor_venta: z.number({ coerce: true }),
  total_impuestos: z.number({ coerce: true }),
  mto_imp_venta: z.number({ coerce: true }),
  hash_cpe: z.string(),
  client: z.object({
    rzn_social: z.string(),
    num_doc: z.string(),
    tipo_doc: z.string(),
  }),
  company: z
    .object({
      ruc: z.string(),
      razon_social: z.string(),
      nombre_comercial: z.string(),
      address: z.object({
        direccion: z.string(),
      }),
    })
    .optional(),
  legends: z
    .array(
      z.object({
        id: z.number(),
        value: z.string(),
      }),
    )
    .optional(),
  sale_details: z.array(
    z.object({
      id: z.number(),
      descripcion: z.string(),
      mto_precio_unitario: z.number({ coerce: true }),
      cantidad: z.number(),
    }),
  ),
  created_at: z.date({ coerce: true }),
});
export const SendSunatsSchema = z.array(SendSunatSchema);
export type SendSunat = z.infer<typeof SendSunatSchema>;

export const SaleDetailFormSchema = z.object({
  id: z.number().int(),
  productId: z.number().int().min(1, { message: 'Debe seleccionar un producto' }),
  productName: z.string().min(1, { message: 'El nombre es obligatorio' }),
  quantity: z.number({ coerce: true }).int().min(1, { message: 'Cantidad positiva' }),
  costPrice: z.number(),
  unitPrice: z
    .string({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .transform(Number)
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  images: z.array(z.object({ id: z.number().int(), path: z.string() })).optional(),
  created: z.boolean().optional(),
  deleted: z.boolean().optional(),
});
export type SaleDetailForm = z.infer<typeof SaleDetailFormSchema>;

export const SaleFormSchema = z.object({
  tipo_doc: z.string(),
  client_id: z.number().int().min(1, { message: 'Seleccionar cliente' }),
  sale_details: z
    .array(
      z.object({
        id: z.number(),
        product_id: z.number(),
        descripcion: z.string(),
        cantidad: z.number(),
        mto_precio_unitario: z.number(),
        image_path: z.string().nullable(),
      }),
    )
    .length(1, { message: 'Agregar al menos un producto' }),
});
export type SaleForm = z.infer<typeof SaleFormSchema>;
