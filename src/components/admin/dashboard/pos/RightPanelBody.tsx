import { SaleForm } from '@/schemas/sales';
import { useFormContext } from 'react-hook-form';
import { ShoppingCart, MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import CartItemProductName from '@/components/admin/dashboard/pos/CartItemProductName';
import CartItemUnitPrice from '@/components/admin/dashboard/pos/CartItemUnitPrice';

interface RightPanelBodyProps {
  sale_details: SaleForm['sale_details'];
}

export default function RightPanelBody({ sale_details }: RightPanelBodyProps) {
  const { control, setValue } = useFormContext<SaleForm>();

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <FormField
        control={control}
        name="sale_details"
        render={() =>
          sale_details.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={48} strokeWidth={1} />
              <p className="mt-2 text-lg">Tu comprobante está vacío</p>
              <p className="text-sm">Añade productos haciendo clic en ellos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sale_details.map((item) => {
                return (
                  <div key={item.id} className="flex items-center gap-3 p-2 border rounded-sm text-sm">
                    <img
                      src={item.image_path ? `${import.meta.env.VITE_API_URL}/storage/${item.image_path}` : '/placeholder.svg'}
                      alt={item.descripcion}
                      className=" object-cover w-16 h-16 rounded shrink-0 shadow-sm"
                    />
                    <div className="flex-1">
                      <CartItemProductName id={item.id} descripcion={item.descripcion} />
                      <div className="flex items-center font-semibold">
                        <span className="mr-1">S/.</span>
                        <CartItemUnitPrice id={item.id} mto_precio_unitario={item.mto_precio_unitario} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          if (item.cantidad === 1) {
                            setValue(
                              'sale_details',
                              sale_details.filter((d) => d.id !== item.id),
                            );
                          } else {
                            setValue(
                              'sale_details',
                              sale_details.map((d) => (d.id === item.id ? { ...item, cantidad: item.cantidad - 1 } : d)),
                            );
                          }
                        }}
                      >
                        <MinusIcon strokeWidth={3} />
                      </Button>
                      <span className="w-4 text-center">{item.cantidad}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setValue(
                            'sale_details',
                            sale_details.map((d) => (d.id === item.id ? { ...item, cantidad: item.cantidad + 1 } : d)),
                          );
                        }}
                      >
                        <PlusIcon strokeWidth={3} />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      className="h-6 w-6 hover:text-red-500 cursor-pointer shrink-0"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setValue(
                          'sale_details',
                          sale_details.filter((d) => d.id !== item.id),
                        );
                      }}
                    >
                      <XIcon strokeWidth={2} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )
        }
      />
    </div>
  );
}
