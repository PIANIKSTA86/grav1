import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  nit: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  suscriptorId: string | null;
}

interface Suscriptor {
  id: string;
  nombre: string;
  nit: string;
  subdominio: string | null;
  emailContacto: string | null;
  direccion: string | null;
  telefono: string | null;
  activo: boolean;
}

interface AuthContextType {
  user: User | null;
  suscriptor: Suscriptor | null;
  login: (nitCopropiedad: string, nitUsuario: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("🔐 AuthProvider initialized");
  const [user, setUser] = useState<User | null>(null);
  const [suscriptor, setSuscriptor] = useState<Suscriptor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Monitor state changes
  React.useEffect(() => {
    console.log("🔄 Auth state changed:", { user: !!user, isAuthenticated: !!user, isLoading });
  }, [user, isLoading]);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuthStatus();

    // Timeout fallback to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Auth check timeout, assuming not authenticated');
        setIsLoading(false);
      }
    }, 3000); // 3 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSuscriptor(data.suscriptor);
      }
    } catch (error) {
      console.log('Auth check failed, assuming not authenticated');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (nitCopropiedad: string, nitUsuario: string, password: string) => {
    console.log("🔐 AuthContext.login llamado con:", { nitCopropiedad, nitUsuario, password: "***" });
    setIsLoading(true);
    try {
      // TEMPORAL: Login mock para testing
      if (nitCopropiedad === "900123456" && nitUsuario === "1234567890" && password === "admin123") {
        console.log("🎭 Usando login mock para Torres del Parque");
        const mockUser = {
          id: "550e8400-e29b-41d4-a716-446655440002",
          nombre: "Admin",
          apellido: "Sistema",
          email: "admin@gravi.com",
          nit: "1234567890",
          activo: true,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          suscriptorId: "550e8400-e29b-41d4-a716-446655440000"
        };
        const mockSuscriptor = {
          id: "550e8400-e29b-41d4-a716-446655440000",
          nombre: "Edificio Torres del Parque",
          nit: "900123456",
          subdominio: "torres-del-parque",
          emailContacto: "admin@torresdelparque.com",
          direccion: "Calle 123 #45-67, Bogotá",
          telefono: "+57 301 234 5678",
          activo: true
        };
        console.log("👤 Setting user:", mockUser);
        setUser(mockUser);
        setSuscriptor(mockSuscriptor);
        console.log("✅ User and suscriptor set successfully");
        return;
      }

      // Mock para Los Alamos
      if (nitCopropiedad === "900987654" && nitUsuario === "1987654321" && password === "admin456") {
        console.log("🎭 Usando login mock para Los Alamos");
        const mockUser = {
          id: "660e8400-e29b-41d4-a716-446655440005",
          nombre: "María",
          apellido: "González",
          email: "maria@losalamos.com",
          nit: "1987654321",
          activo: true,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          suscriptorId: "660e8400-e29b-41d4-a716-446655440003"
        };
        const mockSuscriptor = {
          id: "660e8400-e29b-41d4-a716-446655440003",
          nombre: "Conjunto Residencial Los Alamos",
          nit: "900987654",
          subdominio: "los-alamos",
          emailContacto: "admin@losalamos.com",
          direccion: "Carrera 45 #12-34, Medellín",
          telefono: "+57 304 567 8901",
          activo: true
        };
        console.log("👤 Setting user:", mockUser);
        setUser(mockUser);
        setSuscriptor(mockSuscriptor);
        console.log("✅ User and suscriptor set successfully");
        return;
      }

      console.log("🌐 Haciendo petición a /api/auth/login");
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nitCopropiedad, nitUsuario, password }),
      });

      console.log("📡 Respuesta del servidor:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Error del servidor:", error);
        throw new Error(error.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      console.log("✅ Login exitoso:", data);
      setUser(data.user);
    } catch (error) {
      console.error("❌ Error en AuthContext.login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cerrar sesión');
      }

      setUser(null);
      setSuscriptor(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar usuario');
      }

      const data = await response.json();
      // After registration, user needs to login
      console.log('Usuario registrado:', data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    suscriptor,
    login,
    logout,
    register,
    isLoading,
    isAuthenticated: !!user,
  };

  console.log("🔄 AuthContext value:", { user: !!user, isAuthenticated: !!user, isLoading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}