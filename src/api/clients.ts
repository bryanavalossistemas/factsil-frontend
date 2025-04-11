import api from '@/config/axios';
import { getDateRange } from '@/lib/utils';
import { ClientForm, Client, ClientSchema, ClientsSchema } from '@/schemas/clients';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: ClientForm }) => {
  console.log('hola?');
  const { rzn_social, tipo_doc, num_doc } = data;
  const formData: Omit<Client, 'id'> = {
    rzn_social: rzn_social,
    tipo_doc: tipo_doc,
    num_doc: num_doc,
  };

  try {
    return ClientSchema.parse((await api.post('/clients', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
  let res;

  if (date === null || date === undefined) {
    res = await api.get('/clients');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/clients?startDate=${startDate}&endDate=${endDate}`);
  }

  return ClientsSchema.parse(res.data);
};

export const update = async ({ id, formData: data }: { id: Client['id']; formData: ClientForm }) => {
  const { rzn_social, tipo_doc, num_doc } = data;
  const formData: Omit<Client, 'id'> = {
    rzn_social: rzn_social,
    tipo_doc: tipo_doc,
    num_doc: num_doc,
  };

  try {
    return ClientSchema.parse((await api.patch(`/clients/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Client['id'] }) => {
  try {
    await api.delete(`/clients/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
