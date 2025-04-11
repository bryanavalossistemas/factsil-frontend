import api from '@/config/axios';
import { getDateRange } from '@/lib/utils';
import { ProductSchema, ProductsSchema, Product, ProductForm } from '@/schemas/products';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: ProductForm }) => {
  const formData = new FormData();
  const { name, category_id, cod_producto, image, mto_precio_unitario, tip_afe_igv, unidad } = data;
  formData.append('name', name);
  formData.append('mto_precio_unitario', `${mto_precio_unitario}`);
  formData.append('cod_producto', `${cod_producto || null}`);
  formData.append('category_id', `${category_id || null}`);
  if (unidad) formData.append('unidad', unidad);
	if (tip_afe_igv) formData.append('unidad', tip_afe_igv);
  if (image) formData.append('image', image);

  try {
    return ProductSchema.parse((await api.post('/products', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
  let res;

  if (date === null || date === undefined) {
    res = await api.get('/products');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/products?startDate=${startDate}&endDate=${endDate}`);
  }

  return ProductsSchema.parse(res.data);
};

export const update = async ({ id, formData: data }: { id: Product['id']; formData: ProductForm }) => {
  const formData = new FormData();
  const { name, category_id, cod_producto, image, image_path, mto_precio_unitario, tip_afe_igv, unidad } = data;
  formData.append('_method', 'PUT');
  formData.append('name', name);
  formData.append('mto_precio_unitario', `${mto_precio_unitario}`);
  formData.append('cod_producto', `${cod_producto || null}`);
  formData.append('unidad', unidad);
  formData.append('tip_afe_igv', tip_afe_igv);
  formData.append('category_id', `${category_id || null}`);
  if (image) formData.append('image', image);
  formData.append('image_path', `${image_path}`);

  try {
    return ProductSchema.parse((await api.post(`/products/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Product['id'] }) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
