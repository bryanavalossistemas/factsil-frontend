import { Button } from '@/components/ui/button';
import useStore from '@/store';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function HomeView() {
  const { user, logout } = useStore();

  return (
    <>
      <h1>
        Uste a iniciado sesion correctamente con el email: {user?.email} y el nombre: {JSON.stringify(user?.name)}
      </h1>
      <Button asChild>
        <Link to="/auth/login">Ir al login</Link>
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          logout();
          toast.success('Deslogueo correcto');
        }}
      >
        CERRAR SESION
      </Button>
    </>
  );
}
