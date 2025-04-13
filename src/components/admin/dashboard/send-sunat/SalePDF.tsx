import { toPng } from 'html-to-image';
import { PDFDocument } from 'pdf-lib';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { formatCurrency, formatDateQr } from '@/lib/utils';
import { DownloadIcon, PrinterIcon, XIcon } from 'lucide-react';
import { Sale } from '@/schemas/sales';
import { QRCodeSVG } from 'qrcode.react';

interface CreateButtonProps {
  sale: Sale;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SalePDF({ openDialog, setOpenDialog, sale }: CreateButtonProps) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePDF = async (action: 'download' | 'print' = 'download') => {
    if (!pdfRef.current) return;

    try {
      // 1. Generar imagen PNG del HTML
      const pngDataUrl = await toPng(pdfRef.current, {
        quality: 0.9,
        pixelRatio: 1.5,
        skipFonts: true,
        cacheBust: false,
        skipAutoScale: true,
        filter: (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const elem = node as HTMLElement;
            return !(elem.style.opacity === '0' || elem.style.visibility === 'hidden' || elem.style.display === 'none');
          }
          return true;
        },
      });

      // 2. Crear PDF y procesar imagen en paralelo
      const pdfDoc = await PDFDocument.create();
      const pngImage = await pdfDoc.embedPng(pngDataUrl);

      const page = pdfDoc.addPage([595, 842]);
      const { width, height } = pngImage.scale(1);
      const scale = Math.min(595 / width, 842 / height);

      page.drawImage(pngImage, {
        x: 0,
        y: 842 - height * scale,
        width: width * scale,
        height: height * scale,
      });

      // 3. Guardar PDF con opciones de compresión
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      // 4. Manejo de la descarga/impresión
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);

      if (action === 'download') {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${sale?.serie}-${sale?.correlativo}.pdf`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(pdfUrl);
        }, 100);
      } else {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow?.print();
        };
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const handleDownloadPDF = () => generatePDF('download');
  const handlePrintPDF = () => generatePDF('print');

  // El resto de tu componente permanece igual...
  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="min-w-fit max-h-[95svh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Comprobante</DialogTitle>
            <DialogDescription>Vista previa del comprobante</DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-w-fit overflow-auto">
            {/* Tu contenido HTML para el PDF (igual que antes) */}
            <div id="factura-html" ref={pdfRef} className="px-8 py-5 bg-white mx-auto shadow-none flex flex-col w-[210mm] h-[297mm]">
              {/* Encabezado */}
              <div className="flex justify-between">
                <div>
                  <img src="/placeholder.svg" alt="imagen" className="w-[73mm] h-[23mm] object-cover" />
                  <div className="text-left mt-1">
                    <h1 className="text-sm font-bold">{sale?.company.razon_social}</h1>
                    <p className="text-[9px]">{sale?.company.address.direccion} - LIMA</p>
                    <p className="text-[9px]">Telefonos :(51-1) 3242535/980090445</p>
                    <p className="text-[9px]">representacionesnataly@hotmail.com</p>
                  </div>
                </div>
                <div></div>
              </div>

              <div className="border-1 border-gray-500 text-xs mt-2 flex flex-col gap-y-1 pb-1">
                <span className="bg-blue-invoice pr-4 pl-1 py-1 text-white font-bold w-fit">Datos del Documento:</span>
                <p className="px-2">Cliente: {sale?.client.rzn_social}</p>
                {/* <p className="px-2">Dirección: {client?.address}</p> */}
                <p className="px-2">
                  {sale.client.tipo_doc === '6' ? 'RUC' : 'DNI'}: {sale?.client.num_doc}
                </p>
                <p className="px-2">Forma de pago: Efectivo</p>
              </div>

              {/* Tabla de productos */}
              <div className="flex-1 border border-gray-500 mt-2">
                <table className="text-xs w-full">
                  <thead className="">
                    <tr className="bg-blue-invoice text-white">
                      <th className="border-gray-500 p-2 text-left">Producto</th>
                      <th className="border-gray-500 p-2 text-center">Cantidad</th>
                      <th className="border-gray-500 p-2 text-center">Precio</th>
                      <th className="border-gray-500 p-2 text-center">Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale?.sale_details.map((detail) => (
                      <tr key={detail.id}>
                        <td className="border-gray-500 p-2">{detail.descripcion}</td>
                        <td className="border-gray-500 p-2 text-center">{detail.cantidad}</td>
                        <td className="border-gray-500 p-2 text-right">{formatCurrency(detail.mto_precio_unitario)}</td>
                        <td className="border-gray-500 p-2 text-right">{formatCurrency(detail.mto_precio_unitario * detail.cantidad)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div className="border border-gray-500 mt-2 text-xs">
                <div className="flex justify-between">
                  <QRCodeSVG
                    value={`${sale?.company.ruc}|${sale?.tipo_doc}|${sale?.serie}|${sale?.correlativo}|${sale?.total_impuestos.toFixed(2)}|${sale?.mto_imp_venta.toFixed(2)}|${formatDateQr(new Date(sale?.created_at || new Date()))}|${sale?.client.tipo_doc}|${sale?.client.num_doc}|${sale?.hash_cpe}`}
                  />

                  <div className="flex flex-col justify-between">
                    <div className="w-[105mm] grid grid-cols-2">
                      <div>
                        <div className="border-b border-gray-500 font-bold bg-blue-invoice text-white px-1 py-1">OP. GRAVADA:</div>
                        <div className="border-b border-gray-500 font-bold bg-blue-invoice text-white px-1 py-1">IGV 18%:</div>
                        <div className="font-bold bg-blue-invoice text-white px-1 py-1">TOTAL:</div>
                      </div>

                      <div>
                        <div className="border-b border-gray-500 text-right px-1 py-1 font-bold">{formatCurrency(sale?.valor_venta || 0)}</div>
                        <div className="border-b border-gray-500 text-right px-1 py-1 font-bold">{formatCurrency(sale?.total_impuestos || 0)}</div>
                        <div className="text-right px-1 py-1 font-bold">{formatCurrency(sale?.mto_imp_venta || 0)}</div>
                      </div>
                    </div>

                    <span>Representación impresa de la {sale?.tipo_doc === '01' ? 'FACTURA' : 'BOLETA'} ELECTRÓNICA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" onClick={() => setOpenDialog(false)}>
              <XIcon />
              <span>Salir</span>
            </Button>
            <Button className="cursor-pointer bg-red-700 hover:bg-red-800" type="button" onClick={handleDownloadPDF}>
              <DownloadIcon />
              <span>PDF</span>
            </Button>
            <Button className="cursor-pointer bg-blue-700 hover:bg-blue-800" type="button" onClick={handlePrintPDF}>
              <PrinterIcon />
              <span>Imprimir</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
