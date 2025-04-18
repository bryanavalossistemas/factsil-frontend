import { z } from 'zod';

export const SaleSchema = z.object({
  id: z.number(),
  tipo_doc: z.enum(['01', '03']),
  tipo_operacion: z.string(),
  serie: z.string(),
  correlativo: z.number(),
  tipo_moneda: z.string(),
  valor_venta: z.number({ coerce: true }),
  total_impuestos: z.number({ coerce: true }),
  mto_imp_venta: z.number({ coerce: true }),
  hash_cpe: z.string(),
  estado_sunat: z.enum(['aceptado', 'rechazado', 'pendiente']),
  client_id: z.number(),
  client: z.object({
    rzn_social: z.string(),
    num_doc: z.string(),
    tipo_doc: z.enum(['1', '6']),
  }),
  company: z.object({
    ruc: z.string(),
    razon_social: z.string(),
    nombre_comercial: z.string(),
    address: z.object({
      direccion: z.string(),
    }),
  }),
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
      product_id: z.number(),
    }),
  ),
  created_at: z.date({ coerce: true }),
});
export const SalesSchema = z.array(SaleSchema);
export type Sale = z.infer<typeof SaleSchema>;

export const SaleDetailFormSchema = z.object({
  id: z.number().int(),
  product_id: z.number().int().min(1, { message: 'Debe seleccionar un producto' }),
  descripcion: z.string().min(1, { message: 'El nombre es obligatorio' }),
  cantidad: z.number({ coerce: true }).int().min(1, { message: 'Cantidad positiva' }),
  mto_precio_unitario: z
    .string({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .transform(Number)
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  image_path: z.string().nullable().optional(),
  created: z.boolean().optional(),
  deleted: z.boolean().optional(),
});
export type SaleDetailForm = z.infer<typeof SaleDetailFormSchema>;

export const SaleFormSchema = z.object({
  tipo_doc: z.enum(['01', '03']),
  client_id: z.number().int().min(1, { message: 'Seleccionar cliente' }),
  sale_details: z
    .array(
      z.object({
        id: z.number(),
        product_id: z.number(),
        descripcion: z.string(),
        cantidad: z.number(),
        mto_precio_unitario: z.number(),
        image_path: z.string().nullable().optional(),
        deleted: z.boolean().optional(),
        created: z.boolean().optional(),
      }),
    )
    .length(1, { message: 'Agregar al menos un producto' }),
});
export type SaleForm = z.infer<typeof SaleFormSchema>;
