import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface AuthContextType {
  token?: string;
  setCurrentToken: (token: string) => void;
  removeCurrentToken: () => void;
}

const AuthContext = createContext<Partial<AuthContextType>>({});

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [token, setToken] = useState<string | undefined>(() => {
    const existingToken = localStorage.getItem("access_token");
    if (existingToken) {
      return JSON.parse(existingToken);
    }
  });

  const setCurrentToken = (token: string) => {
    localStorage.setItem("access_token", JSON.stringify(token));
    setToken(token);
  };

  const removeCurrentToken = () => {
    localStorage.removeItem("access_token");
    setToken(undefined);
  };

  const providerValue = useMemo(() => {
    return { token, setCurrentToken, removeCurrentToken };
  }, [token, setCurrentToken, removeCurrentToken]);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
