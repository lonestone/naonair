import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { ARSnackbarProps } from "../components/molecules/ARSnackbarAlert";

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
    open: false,
  });

  const setSnackbarStatus = (snackbarProps: ARSnackbarProps) => {
    setSnackbarProps({
      open: snackbarProps.open,
      message: snackbarProps.message,
      severity: snackbarProps.severity,
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
