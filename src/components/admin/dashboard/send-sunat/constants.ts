export interface Columns {
  [key: string]: string;
}

export const columns: Columns = {
  tipo_doc: 'Tipo de Comprobante',
  serie: 'Serie',
  correlativo: 'N° Documento',
  created_at: 'Fecha',
  client_rzn_social: 'Cliente',
  mto_imp_venta: 'Total',
};

export const dateOptions = [
  { id: 1, label: 'Este mes', value: null },
  { id: 2, label: 'Este año', value: 'this-year' },
  { id: 3, label: 'Siempre', value: 'always' },
];

export const columnsToExport = [
  { header: 'Id', key: 'id' },
  { header: 'Tipo de Comprobante', key: 'tipo_doc' },
  { header: 'Cliente', key: 'client_rzn_social' },
  { header: 'RUC / DNI', key: 'supplierDocument' },
  { header: 'Total', key: 'mto_imp_venta' },
];

export const pageSize = window.innerWidth < 640 ? 3 : 5;
