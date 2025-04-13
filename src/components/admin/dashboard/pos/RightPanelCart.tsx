import RightPanelHeading from '@/components/admin/dashboard/pos/RightPanelHeading';
import { useClients } from '@/hooks/useClients';
import RightPanelBody from '@/components/admin/dashboard/pos/RightPanelBody';
import RightPanelFooter from '@/components/admin/dashboard/pos/RightPanelFooter';
import { SaleForm } from '@/schemas/sales';
import { useFormContext, useWatch } from 'react-hook-form';

export default function RightPanelCart() {
  const { data: clients = [] } = useClients();

  const { control } = useFormContext<SaleForm>();

  const sale_details = useWatch({ control: control, name: 'sale_details' });

  return (
    <div className="w-100 border-l flex flex-col">
      {/* Right Panel - Cart */}
      <RightPanelHeading clients={clients} />

      <RightPanelBody sale_details={sale_details} />

      <RightPanelFooter sale_details={sale_details} />
    </div>
  );
}
