import api from '@/config/axios';
import { getDateRange } from '@/lib/utils';
import { Sale, SaleForm, SaleSchema, SalesSchema } from '@/schemas/sales';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: SaleForm }) => {
  const { client_id, tipo_doc, sale_details } = data;

  const formData = {
    client_id: client_id,
    tipo_doc: tipo_doc,
    sale_details: sale_details.map((d) => {
      return {
        product_id: d.product_id,
        descripcion: d.descripcion,
        cantidad: d.cantidad,
        mto_precio_unitario: d.mto_precio_unitario,
      };
    }),
  };

  try {
    return SaleSchema.parse((await api.post('/sales', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
  let res;

  if (date === null || date === undefined) {
    res = await api.get('/sales');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/sales?from=${startDate}&to=${endDate}`);
  }

  try {
    return SalesSchema.parse(res.data);
  } catch (error) {
    console.log(error);
  }
};

export const update = async ({ id, formData: data }: { id: Sale['id']; formData: SaleForm }) => {
  const { client_id, tipo_doc, sale_details } = data;

  const formData = {
    client_id: client_id,
    tipo_doc: tipo_doc,
    sale_details: sale_details.map((d) => {
      return {
        product_id: d.product_id,
        descripcion: d.descripcion,
        cantidad: d.cantidad,
        mto_precio_unitario: d.mto_precio_unitario,
      };
    }),
  };

  try {
    return SaleSchema.parse((await api.patch(`/sales/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Sale['id'] }) => {
  try {
    await api.delete(`/sales/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
