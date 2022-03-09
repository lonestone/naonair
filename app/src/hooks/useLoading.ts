import { useCallback, useEffect, useRef, useState } from 'react';

export const useLoading = <U>(callback: () => Promise<U>, defaultValue: U) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [results, setResults] = useState<U>(defaultValue);
  const [error, setError] = useState<any | undefined>();
  const fetched = useRef(false);

  const action = useCallback(async () => {
    if (fetched.current) {
      return;
    }

    fetched.current = true;
    try {
      setIsLoading(true);

      setResults(await callback());
    } catch (e) {
      setError(e);
    }
    setIsLoading(false);
  }, [setError, setResults, setIsLoading, callback, fetched]);

  useEffect(() => {
    action();
  }, [action]);

  return {
    results,
    isLoading,
    error,
  };
};
