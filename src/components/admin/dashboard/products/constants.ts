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

export const measurementUnits = [
  { label: 'Unidad', value: 'NIU' }, // Unidad (unidad estándar)
  { label: 'Kilogramo', value: 'KGM' }, // Peso en kilos
  { label: 'Gramo', value: 'GRM' }, // Peso en gramos
  { label: 'Litro', value: 'LTR' }, // Volumen
  { label: 'Metro', value: 'MTR' }, // Longitud
  { label: 'Metro cuadrado', value: 'MTK' }, // Área
  { label: 'Metro cúbico', value: 'MTQ' }, // Volumen
  { label: 'Caja', value: 'BX' }, // Caja (Box)
  { label: 'Paquete', value: 'PK' }, // Paquete
  { label: 'Par', value: 'PR' }, // Par de productos
  { label: 'Docena', value: 'DZN' }, // 12 unidades
  { label: 'Galón', value: 'GLL' }, // Medida de líquidos
  { label: 'Bolsa', value: 'BG' }, // Bolsa
  { label: 'Frasco', value: 'CS' }, // Contenedor tipo frasco
];

export const igvEffects = [
  { label: 'Gravado - Operación Onerosa', value: '10' }, // Unidad (unidad estándar)
  { label: 'Exonerado - Operación Onerosa', value: '20' }, // Peso en kilos
];

export const pageSize = window.innerWidth < 640 ? 3 : 5;
