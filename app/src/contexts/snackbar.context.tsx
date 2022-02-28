import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { ARSnackbarProps } from '../components/atoms/ARSnackbar';

interface SnackbarContextType {
  snackbarProps: ARSnackbarProps;
  setSnackbarStatus: (snackbarProps: ARSnackbarProps) => void;
}

const SnackbarContext = createContext<Partial<SnackbarContextType>>({});

export function SnackbarProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [snackbarProps, setSnackbarProps] = useState<ARSnackbarProps>({
    isVisible: false,
  });

  const setSnackbarStatus = (snackbarProps: ARSnackbarProps) => {
    setSnackbarProps({
      isVisible: snackbarProps.isVisible,
      backgroundColor: snackbarProps.backgroundColor,
      icon: snackbarProps.icon,
      label: snackbarProps.label,
    });
  };

  const providerValue = useMemo(() => {
    return { snackbarProps, setSnackbarStatus };
  }, [snackbarProps, setSnackbarStatus]);

  return (
    <SnackbarContext.Provider value={providerValue}>
      {children}
    </SnackbarContext.Provider>
  );
}

export default function useSnackbar() {
  return useContext(SnackbarContext);
}
