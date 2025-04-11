export interface Columns {
  [key: string]: string;
}

export const columns: Columns = {
  rzn_social: 'Nombre',
  tipo_doc: 'RUC/DNI',
  num_doc: 'N° Documento',
};

export const columnsToExport = [
  { header: 'Id', key: 'id' },
  { header: 'Nombre', key: 'rzn_social' },
  { header: 'RUC/DNI', key: 'tipo_doc' },
  { header: 'N° Documento', key: 'num_doc' },
];

export const dateOptions = [
  { id: 1, label: 'Este mes', value: 'this-month' },
  { id: 2, label: 'Este año', value: 'this-year' },
  { id: 3, label: 'Siempre', value: null },
];

export const pageSize = window.innerWidth < 640 ? 3 : 5;
