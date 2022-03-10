import { useCallback, useEffect, useRef, useState } from 'react';

export const useLoading = <U>(callback: () => Promise<U>, defaultValue: U) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [results, setResults] = useState<U>(defaultValue);
  const [error, setError] = useState<any | undefined>();
  const fetched = useRef(false);
  const mounted = useRef(false);

  const action = useCallback(async () => {
    if (fetched.current || !mounted.current) {
      return;
    }

    fetched.current = true;
    try {
      setIsLoading(true);

      const temp = await callback();
      if (mounted.current) {
        setResults(temp);
      }
    } catch (e) {
      if (mounted.current) {
        setError(e);
      }
    }

    if (mounted.current) {
      setIsLoading(false);
    }
  }, [setError, setResults, setIsLoading, callback, fetched, mounted]);

  useEffect(() => {
    mounted.current = true;
    action();

    return () => {
      mounted.current = false;
    };
  }, [action, mounted]);

  return {
    results,
    isLoading,
    error,
  };
};
