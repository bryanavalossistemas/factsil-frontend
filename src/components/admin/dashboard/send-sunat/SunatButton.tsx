import { sendSunat } from '@/api/sendSunat';
import { Button } from '@/components/ui/button';
import { Sale } from '@/schemas/sales';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SunatButtonProps {
  id: Sale['id'];
}

export default function SunatButton({ id }: SunatButtonProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => sendSunat({ id }),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Comprobante enviado a SUNAT correctamente');
    },
  });

  return (
    <Button className="bg-lime-600" disabled={isPending} onClick={() => mutate()}>
      Sunat
    </Button>
  );
}
