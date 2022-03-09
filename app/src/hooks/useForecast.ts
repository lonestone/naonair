import { forecast } from '../actions/qa';
import { useLoading } from './useLoading';

export const useForecast = (id: number) => {
  // useEffect(() => {
  //   useLoading(() => forecast(id));
  // }, []);
  const { isLoading, results, error } = useLoading(() => forecast(id), []);

  return { isLoading, error, indices: results };
};
