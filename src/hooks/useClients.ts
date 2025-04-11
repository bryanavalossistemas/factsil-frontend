import { findAll } from '@/api/clients';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

export const useClients = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  return useQuery({
    queryKey: date === null ? ['clients'] : ['clients', date],
    queryFn: () => findAll(date),
  });
};
