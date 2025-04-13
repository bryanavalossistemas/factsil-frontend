import SalePDF from '@/components/admin/dashboard/send-sunat/SalePDF';
import { Button } from '@/components/ui/button';
import { Sale } from '@/schemas/sales';
import { EyeIcon } from 'lucide-react';
import { useState } from 'react';

interface PrintButtonProps {
  sale: Sale;
}

export default function SeeButton({ sale }: PrintButtonProps) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div>
        <Button onClick={() => setOpenDialog(true)}>
          <EyeIcon />
          <span>Ver</span>
        </Button>
      </div>
      <SalePDF openDialog={openDialog} setOpenDialog={setOpenDialog} sale={sale} />
    </>
  );
}
