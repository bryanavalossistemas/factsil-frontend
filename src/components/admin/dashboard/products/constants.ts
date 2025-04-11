export interface Columns {
  [key: string]: string;
}

export const columns: Columns = {
  image_path: 'Imagen',
  name: 'Nombre',
  stock: 'Stock',
  mto_precio_unitario: 'Venta',
};

export const dateOptions = [
  { id: 1, label: 'Este mes', value: 'this-month' },
  { id: 2, label: 'Este año', value: 'this-year' },
  { id: 3, label: 'Siempre', value: null },
];

export const columnsToExport = [
  { header: 'Id', key: 'id' },
  { header: 'Nombre', key: 'name' },
  { header: 'Stock', key: 'stock' },
  { header: 'Venta', key: 'mto_precio_unitario' },
];

export const pageSize = window.innerWidth < 640 ? 3 : 5;
