import { findAll } from '@/api/sendSunat';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

export const useSendSunat = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  return useQuery({
    queryKey: date === null ? ['sendSunat'] : ['sendSunat', date],
    queryFn: () => findAll(date === null ? 'this-month' : date),
  });
};
