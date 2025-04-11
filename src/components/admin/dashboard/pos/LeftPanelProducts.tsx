import { useState, useMemo } from 'react';
import { SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import CreateButtonProducts from '@/components/admin/dashboard/products/CreateButton';
import { SaleForm } from '@/schemas/sales';
import { useProducts } from '@/hooks/useProducts';
import { useFormContext } from 'react-hook-form';

export default function LeftPanelProducts() {
  const { data: products = [] } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const { setValue, getValues } = useFormContext<SaleForm>();

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-3 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar producto..."
              type="search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CreateButtonProducts variant="outline" />
        </div>
      </div>

      <div className="p-3 overflow-y-auto">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
          {/* Product Cards */}
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-md transition-shadow p-0 overflow-hidden gap-0"
              onClick={() => {
                setValue('sale_details', [
                  {
                    id: Date.now(),
                    product_id: product.id,
                    descripcion: product.name,
                    cantidad: 1,
                    mto_precio_unitario: product.mto_precio_unitario,
                    image_path: product.image_path,
                  },
                  ...getValues('sale_details'),
                ]);
              }}
            >
              <img
                src={product.image_path ? `${import.meta.env.VITE_API_URL}/storage/${product.image_path}` : '/placeholder.svg'}
                alt={product.name}
                className="object-cover h-50 w-full"
              />
              <CardContent className="p-3">
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-primary font-bold">{formatCurrency(product.mto_precio_unitario)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
