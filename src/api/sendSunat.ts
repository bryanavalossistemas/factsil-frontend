import api from '@/config/axios';
import { delay, getDateRange } from '@/lib/utils';
import { Sale, SalesSchema } from '@/schemas/sales';
import { isAxiosError } from 'axios';

export const findAll = async (date: string) => {
  let res;
  if (date === 'always') {
    res = await api.get('/sales?filters[estado_sunat][%3D]=pendiente');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/sales?filters[estado_sunat][%3D]=pendiente&from=${startDate}&to=${endDate}`);
  }

  try {
    return SalesSchema.parse(res.data);
  } catch (error) {
    console.log(error);
  }
};

export const sendSunat = async ({ id }: { id: Sale['id'] }) => {
  await delay(3);

  try {
    await api.post(`/sales/${id}/send-sunat`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
