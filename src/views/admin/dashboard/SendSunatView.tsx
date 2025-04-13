import DashboardHeader from '@/components/admin/dashboard/ui/DashboardHeader';
import DashboardTitle from '@/components/admin/dashboard/ui/DashboardTitle';
import { Separator } from '@/components/ui/separator';
import { SidebarInset } from '@/components/ui/sidebar';
import { Table } from '@/components/admin/dashboard/send-sunat/Table';

const breadcrumb = {
  page: {
    label: 'Envíos a Sunat',
  },
};

export default function SendSunatView() {
  return (
    <SidebarInset>
      <DashboardHeader breadcrumb={breadcrumb} />
      <div className="flex-1 p-2 sm:p-4">
        <div className="sm:flex sm:justify-between sm:items-end">
          <DashboardTitle title="Envíos a Sunat" description="Envia tus documentos a Sunat" />
        </div>
        <Separator className="hidden sm:block mt-2" />
        <Table />
      </div>
    </SidebarInset>
  );
}
